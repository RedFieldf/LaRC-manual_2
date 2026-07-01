import { useState, useEffect, useMemo } from "react";
import type { SeedingRecord } from "./types";
import type { AuthUser } from "../shared/types";
import { sha256 } from "../shared/crypto";
import { ADMIN_HASH } from "./constants";
import { CalendarView } from "./components/CalendarView";
import { IconBack, IconCalendar, IconPlus, IconTrash } from "./icons";

export function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allReservations, setAllReservations] = useState<SeedingRecord[]>([]); // 全データ保持
  const [loading, setLoading] = useState(true);

  // モーダル関連
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SeedingRecord | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  // 入力フォーム
  const [inputName, setInputName] = useState("");
  const [inputDensity, setInputDensity] = useState("");
  const [inputCellVol, setInputCellVol] = useState("");
  const [inputCollagenVol, setInputCollagenVol] = useState("");
  const [inputNote, setInputNote] = useState("");

  // ★★★ 過去日判定ロジック ★★★
  const isPastDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今日の0時0分0秒
    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0); // ターゲット日の0時0分0秒
    return target < today;
  }, [selectedDate]);

  // 1. Firebase ログイン監視
  useEffect(() => {
    const { signInAnonymously, onAuthStateChanged } = window.firebaseModules;
    signInAnonymously(window.auth).catch((e: any) =>
      console.error("Auth Error:", e),
    );

    const unsubscribe = onAuthStateChanged(
      window.auth,
      (u: AuthUser | null) => {
        setUser(u);
        if (u) {
          const savedName = localStorage.getItem("my_name_seeding");
          if (savedName) setInputName(savedName);
        }
      },
    );
    return () => unsubscribe();
  }, []);

  // 2. データ監視
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const { collection, query, orderBy, onSnapshot } = window.firebaseModules;
    const q = query(
      collection(
        window.db,
        "artifacts",
        window.appId,
        "public",
        "data",
        "seeding_reservations",
      ),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: any) => {
        const data = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as SeedingRecord[];
        setAllReservations(data);
        setLoading(false);
      },
      (error: any) => {
        console.error("DB Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  // 選択された日付のデータ
  const dayReservations = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return allReservations.filter((r) => r.date === dateStr);
  }, [allReservations, selectedDate]);

  // 日別合計計算
  const dayTotals = useMemo(() => {
    return dayReservations.reduce(
      (acc, curr) => {
        acc.collagen += Number(curr.collagenVol) || 0;

        const dens =
          curr.density && curr.density.trim() !== "" ? curr.density : "未指定";
        const vol = Number(curr.cellVol) || 0;
        if (!acc.cellByDensity[dens]) {
          acc.cellByDensity[dens] = 0;
        }
        acc.cellByDensity[dens] += vol;

        return acc;
      },
      { cellByDensity: {} as Record<string, number>, collagen: 0 },
    );
  }, [dayReservations]);

  const dateDisplay = useMemo(() => {
    const d = selectedDate;
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  }, [selectedDate]);

  // 登録処理
  const handleSubmit = async () => {
    if (!inputName.trim()) return alert("名前を入力してください");
    if (!user) return;
    localStorage.setItem("my_name_seeding", inputName);
    const { collection, addDoc } = window.firebaseModules;
    const dateStr = selectedDate.toISOString().split("T")[0];
    try {
      await addDoc(
        collection(
          window.db,
          "artifacts",
          window.appId,
          "public",
          "data",
          "seeding_reservations",
        ),
        {
          date: dateStr,
          name: inputName,
          density: inputDensity,
          cellVol: Number(inputCellVol),
          collagenVol: Number(inputCollagenVol),
          note: inputNote,
          uid: user.uid,
          createdAt: new Date().toISOString(),
        },
      );
      setIsAddModalOpen(false);
      setInputDensity("");
      setInputCellVol("");
      setInputCollagenVol("");
      setInputNote("");
    } catch (e) {
      alert("保存に失敗しました");
    }
  };

  // 削除処理
  const handleDeleteClick = (item: SeedingRecord) => {
    if (!user) return;
    setDeleteTarget(item);
    setDeletePassword("");
    if (item.uid === user.uid) {
      if (confirm("このデータを削除しますか？")) executeDelete(item.id);
    } else {
      setIsDeleteModalOpen(true);
    }
  };
  const executeDelete = async (docId: string) => {
    const { doc, deleteDoc } = window.firebaseModules;
    try {
      await deleteDoc(
        doc(
          window.db,
          "artifacts",
          window.appId,
          "public",
          "data",
          "seeding_reservations",
          docId,
        ),
      );
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      alert("削除に失敗しました");
    }
  };
  const handleAdminDelete = async () => {
    if (!deleteTarget) return;
    const hash = await sha256(deletePassword);
    if (hash === ADMIN_HASH) executeDelete(deleteTarget.id);
    else alert("パスワードが違います");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg overflow-hidden flex flex-col relative">
      {/* ヘッダー */}
      <div className="bg-slate-800 text-white p-4 flex items-center shadow-md shrink-0 z-20">
        <a
          href="index.html"
          className="mr-3 p-2 hover:bg-slate-700 rounded-full transition"
        >
          <IconBack />
        </a>
        <h1 className="font-bold text-lg">播種量予約システム</h1>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden relative">
        {/* カレンダービュー */}
        {viewMode === "calendar" && (
          <div className="h-full animate-fade-in">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setViewMode("list");
              }}
              allReservations={allReservations}
            />
          </div>
        )}

        {/* リストビュー (詳細) */}
        {viewMode === "list" && (
          <div className="h-full flex flex-col animate-fade-in bg-f3f4f6">
            {/* 日付ナビゲーション */}
            <div className="flex justify-between items-center p-3 bg-gray-50 border-b sticky top-0 z-10">
              <button
                onClick={() => setViewMode("calendar")}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-white shadow text-sm font-bold text-gray-600 hover:bg-gray-100"
              >
                <IconCalendar /> カレンダー
              </button>
              <div className="font-bold text-lg text-gray-700">
                {dateDisplay}
              </div>
              <div className="w-20"></div>
            </div>

            {/* 合計表示パネル */}
            <div className="bg-teal-50 p-4 border-b border-teal-100 shadow-inner shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 text-center border-r border-teal-200 pr-2">
                  <p className="text-xs text-teal-600 font-bold mb-1">
                    心筋細胞 (密度別合計)
                  </p>
                  {Object.keys(dayTotals.cellByDensity).length === 0 ? (
                    <p className="text-xl font-bold text-teal-800">
                      0 <span className="text-sm">µl</span>
                    </p>
                  ) : (
                    <div className="text-sm text-teal-800 text-left inline-block w-full px-2">
                      {Object.entries(dayTotals.cellByDensity).map(
                        ([density, vol]) => (
                          <div
                            key={density}
                            className="flex justify-between gap-2 border-b border-teal-100 last:border-0 py-0.5"
                          >
                            <span
                              className="font-medium truncate text-xs"
                              title={density}
                            >
                              {density}
                            </span>
                            <span className="font-bold whitespace-nowrap">
                              {vol.toLocaleString()} µl
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center pl-2 flex flex-col justify-center">
                  <p className="text-xs text-orange-600 font-bold mb-1">
                    コラーゲン (合計)
                  </p>
                  <p className="text-2xl font-bold text-orange-800">
                    {dayTotals.collagen.toLocaleString()}{" "}
                    <span className="text-sm">µl</span>
                  </p>
                </div>
              </div>
            </div>

            {/* リスト表示エリア */}
            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 pb-24">
              {isPastDate && (
                <div className="mb-4 text-center text-gray-500 bg-gray-200 p-2 rounded text-sm font-bold">
                  過去の日付のため編集できません
                </div>
              )}
              {loading ? (
                <div className="text-center py-10 text-gray-400">
                  読み込み中...
                </div>
              ) : (
                <div className="space-y-3">
                  {dayReservations.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      <p>まだ登録はありません</p>
                      {!isPastDate && (
                        <p className="text-sm">
                          右下のボタンから追加してください
                        </p>
                      )}
                    </div>
                  )}
                  {dayReservations.map((item) => {
                    const isMine = user && item.uid === user.uid;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${isMine ? "border-blue-500" : "border-gray-300"} animate-fade-in relative`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span
                              className={`font-bold text-lg ${isMine ? "text-blue-700" : "text-gray-800"}`}
                            >
                              {item.name}
                            </span>
                            {isMine && (
                              <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                あなた
                              </span>
                            )}
                          </div>
                          {/* 削除ボタン：過去日でない場合のみ表示 */}
                          {!isPastDate && (
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="text-gray-300 hover:text-red-500 p-1"
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div>
                            <span className="text-gray-400 text-xs block">
                              密度 (個/ml)
                            </span>
                            <span className="font-medium">
                              {item.density || "-"}
                            </span>
                          </div>
                          <div></div>
                          <div className="bg-teal-50 p-2 rounded">
                            <span className="text-teal-600 text-xs block font-bold">
                              心筋細胞
                            </span>
                            <span className="font-bold text-lg text-teal-800">
                              {Number(item.cellVol).toLocaleString()} µl
                            </span>
                          </div>
                          <div className="bg-orange-50 p-2 rounded">
                            <span className="text-orange-600 text-xs block font-bold">
                              コラーゲン
                            </span>
                            <span className="font-bold text-lg text-orange-800">
                              {Number(item.collagenVol).toLocaleString()} µl
                            </span>
                          </div>
                        </div>
                        {item.note && (
                          <div className="mt-3 pt-2 border-t border-gray-100 text-sm text-gray-600">
                            <span className="font-bold text-xs text-gray-400 mr-1">
                              備考:
                            </span>
                            {item.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 追加ボタン (リストモード時かつ過去日でない場合のみ表示) */}
      {viewMode === "list" && !isPastDate && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition active:scale-95 z-30"
        >
          <IconPlus />
        </button>
      )}

      {/* --- 追加モーダル --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              播種データ登録
            </h3>
            <p className="text-sm text-gray-500 mb-4">{dateDisplay}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  名前 (苗字)
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50"
                  placeholder="例: 佐藤"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  密度 (個/ml)
                </label>
                <input
                  type="text"
                  value={inputDensity}
                  onChange={(e) => setInputDensity(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50"
                  placeholder="例: 1.0e7"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-teal-700 mb-1">
                    心筋細胞 (µl)
                  </label>
                  <input
                    type="number"
                    value={inputCellVol}
                    onChange={(e) => setInputCellVol(e.target.value)}
                    className="w-full p-2 border border-teal-200 rounded bg-teal-50 font-bold text-right"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-orange-700 mb-1">
                    コラーゲン (µl)
                  </label>
                  <input
                    type="number"
                    value={inputCollagenVol}
                    onChange={(e) => setInputCollagenVol(e.target.value)}
                    className="w-full p-2 border border-orange-200 rounded bg-orange-50 font-bold text-right"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  備考
                </label>
                <textarea
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50 h-16 resize-none"
                  placeholder="自由記述"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-lg shadow"
              >
                登録する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 管理者削除モーダル --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-red-600 mb-2">管理者削除</h3>
            <p className="text-sm text-gray-600 mb-4">
              他人のデータを削除するには
              <br />
              管理者パスワードが必要です。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Password"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 bg-gray-200 rounded text-sm font-bold"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdminDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded text-sm font-bold"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
