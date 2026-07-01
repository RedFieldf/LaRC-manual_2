import { useState, useEffect, useMemo } from "react";
import type { Reservation, TimeSlot } from "./types";
import type { AuthUser } from "../shared/types";
import { sha256 } from "../shared/crypto";
import { ADMIN_HASH, RESOURCES, TIME_SLOTS } from "./constants";
import { isBookingAllowed } from "./booking";
import { CalendarView } from "./components/CalendarView";
import {
  IconBack,
  IconCalendar,
  IconInfo,
  IconLaser,
  IconLock,
  IconNote,
  IconTrash,
  IconUser,
  IconWifiOff,
} from "./icons";

export function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [db, setDb] = useState<any>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedResource, setSelectedResource] = useState(RESOURCES[0].id);
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [status, setStatus] = useState("initializing"); // initializing, loading, ready, error
  const [authError, setAuthError] = useState<{ message?: string } | null>(null);
  const [sdkError, setSdkError] = useState(false);
  const [dbError, setDbError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [targetSlot, setTargetSlot] = useState<TimeSlot | null>(null);
  const [inputName, setInputName] = useState("");
  const [inputNote, setInputNote] = useState("");
  const [inputPurpose, setInputPurpose] = useState("mea");
  const [inputWavelength, setInputWavelength] = useState("1480");

  // 初期化と認証
  useEffect(() => {
    const initFirebase = async () => {
      if (!window.firebaseModules) {
        setSdkError(true);
        setStatus("error");
        return;
      }
      const {
        initializeApp,
        getAuth,
        signInAnonymously,
        onAuthStateChanged,
        getFirestore,
      } = window.firebaseModules;
      const firebaseConfig = JSON.parse(window.__firebase_config || "{}");
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestore = getFirestore(app);
      const currentAppId =
        typeof window.__app_id !== "undefined"
          ? window.__app_id
          : "default-app-id";
      setDb(firestore);
      setAppId(currentAppId);

      // 認証開始
      setStatus("authenticating");
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth Error:", e);
        setAuthError(e as { message?: string });
        setStatus("error");
        return;
      }

      onAuthStateChanged(auth, (u: AuthUser | null) => {
        if (u) {
          setUser(u);
          const savedName = localStorage.getItem("my_name");
          if (savedName) setInputName(savedName);
        }
      });
    };

    let retries = 0;
    const checkFirebase = setInterval(() => {
      if (window.firebaseModules) {
        clearInterval(checkFirebase);
        initFirebase();
      } else if (retries > 50) {
        clearInterval(checkFirebase);
        setSdkError(true);
        setStatus("error");
      }
      retries++;
    }, 100);
    return () => clearInterval(checkFirebase);
  }, []);

  // データ取得
  useEffect(() => {
    if (!db || !user || !appId) return;
    setStatus("loading_data");

    const { collection, onSnapshot } = window.firebaseModules;
    const reservationsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "mea_reservations",
    );

    // タイムアウト設定（もしDBが作成されていなくてスタックする場合用）
    const timeoutId = setTimeout(() => {
      if (status === "loading_data") {
        setDbError(true);
        setStatus("error");
      }
    }, 8000);

    const unsubscribe = onSnapshot(
      reservationsRef,
      (snapshot: any) => {
        clearTimeout(timeoutId);
        const data = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reservation[];
        setAllReservations(data);
        setStatus("ready");
        setDbError(false);
      },
      (error: any) => {
        clearTimeout(timeoutId);
        console.error("DB Error:", error);
        // 権限エラーなど
        setDbError(true);
        setStatus("error");
      },
    );
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [db, user, appId]);

  const currentReservations = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return allReservations.filter(
      (r) => r.date === dateStr && r.resourceId === selectedResource,
    );
  }, [allReservations, selectedDate, selectedResource]);

  const resourceReservations = useMemo(() => {
    return allReservations.filter((r) => r.resourceId === selectedResource);
  }, [allReservations, selectedResource]);

  const handleSlotClick = (slot: TimeSlot) => {
    const status = isBookingAllowed(selectedDate);
    const existing = currentReservations.find((r) => r.time === slot.id);
    if (existing) {
      setDeleteTarget(existing);
      setDeletePassword("");
      setDeleteError("");
      setTargetSlot(slot);
      setIsDeleteModalOpen(true);
    } else {
      if (!status.allowed) {
        alert(status.reason);
        return;
      }
      setTargetSlot(slot);
      setInputNote("");
      setInputPurpose("mea");
      setInputWavelength("1480");
      setIsModalOpen(true);
    }
  };

  const submitReservation = async () => {
    if (!inputName.trim()) {
      alert("名前（苗字）を入力してください");
      return;
    }
    if (!targetSlot || !user) return;
    localStorage.setItem("my_name", inputName);
    const { collection, addDoc } = window.firebaseModules;
    const dateStr = selectedDate.toISOString().split("T")[0];
    const saveData: Record<string, string> = {
      date: dateStr,
      resourceId: selectedResource,
      time: targetSlot.id,
      name: inputName,
      note: inputNote,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    };
    if (selectedResource === "laser-plus") {
      saveData.purpose = inputPurpose;
      saveData.wavelength = inputWavelength;
    }
    try {
      await addDoc(
        collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "mea_reservations",
        ),
        saveData,
      );
      setIsModalOpen(false);
    } catch (e) {
      alert("予約に失敗しました。");
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget || !user) return;
    if (deleteTarget.uid !== user.uid) {
      const hash = await sha256(deletePassword);
      if (hash !== ADMIN_HASH) {
        setDeleteError("パスワードが違います");
        return;
      }
    }
    const { doc, deleteDoc } = window.firebaseModules;
    try {
      const docRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "mea_reservations",
        deleteTarget.id,
      );
      await deleteDoc(docRef);
      setIsDeleteModalOpen(false);
    } catch (e) {
      alert("削除に失敗しました。");
    }
  };

  const dateDisplay = useMemo(() => {
    const d = selectedDate;
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}/${d.getDate()} (${days[d.getDay()]})`;
  }, [selectedDate]);

  const bookingStatus = isBookingAllowed(selectedDate);
  const isMyReservation = deleteTarget && user && deleteTarget.uid === user.uid;

  // ★★★ エラー・ローディング画面 ★★★
  if (sdkError) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4 text-white">
        通信エラー: プログラムを読み込めませんでした。再読み込みしてください。
      </div>
    );
  }
  if (authError) {
    // URLブロックエラー
    const match =
      authError.message &&
      authError.message.match(/requests-from-referer-(.*?)-are-blocked/);
    let blockedUrl = match ? match[1] : window.location.href;
    if (blockedUrl.endsWith(".")) blockedUrl = blockedUrl.slice(0, -1);
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-left">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <IconInfo /> 接続許可が必要です
          </h2>
          <div className="text-sm text-gray-700 mb-4">
            Google Cloud Console
            の「APIキーの制限」に以下のURLを追加してください。
          </div>
          <div className="bg-gray-100 p-3 rounded border border-gray-300 mb-4 font-mono text-xs break-all select-all font-bold text-blue-600">
            {blockedUrl}
          </div>
        </div>
      </div>
    );
  }
  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-left">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <IconWifiOff /> データベース未作成
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            Firestoreデータベースが見つかりません。
          </p>
          <p className="text-gray-600 text-xs">
            Firebaseコンソールで「Firestore
            Database」を開き、「データベースの作成」を行ってください。
          </p>
        </div>
      </div>
    );
  }

  // 準備中画面
  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold">
          {status === "initializing" && "システム起動中..."}
          {status === "authenticating" && "認証中..."}
          {status === "loading_data" && "予約データ取得中..."}
        </p>
      </div>
    );
  }

  // メイン画面
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg overflow-hidden flex flex-col relative">
      <div className="bg-slate-800 text-white p-4 flex items-center shadow-md shrink-0 z-20">
        <a
          href="index.html"
          className="mr-3 p-2 hover:bg-slate-700 rounded-full transition"
        >
          <IconBack />
        </a>
        <h1 className="font-bold text-lg">MEA予約システム</h1>
      </div>
      <div className="flex border-b shrink-0 bg-white z-20">
        {RESOURCES.map((res) => (
          <button
            key={res.id}
            onClick={() => setSelectedResource(res.id)}
            className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${selectedResource === res.id ? `bg-${res.color}-50 text-${res.color}-600 border-b-4 border-${res.color}-500` : "text-gray-500 hover:bg-gray-50"}`}
          >
            {res.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden relative">
        {viewMode === "calendar" && (
          <div className="h-full animate-fade-in">
            <CalendarView
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setViewMode("slots");
              }}
              reservations={resourceReservations}
            />
          </div>
        )}
        {viewMode === "slots" && (
          <div className="h-full flex flex-col animate-fade-in bg-f3f4f6">
            <div className="flex justify-between items-center p-3 bg-gray-50 border-b sticky top-0 z-10 shrink-0">
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
            {!bookingStatus.allowed && (
              <div className="bg-red-100 text-red-700 p-2 text-center text-sm font-bold border-b border-red-200">
                <IconLock className="inline mb-1 mr-1" /> {bookingStatus.reason}
              </div>
            )}
            <div className="flex-1 p-2 overflow-y-auto">
              <div className="space-y-2 pb-20">
                {TIME_SLOTS.map((slot) => {
                  const reservation = currentReservations.find(
                    (r) => r.time === slot.id,
                  );
                  const isMine =
                    reservation && user && reservation.uid === user.uid;
                  const isOccupied = !!reservation;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`slot-card flex flex-col justify-center p-3 rounded-lg border-l-4 shadow-sm cursor-pointer select-none min-h-[72px] ${isOccupied ? (isMine ? "bg-blue-50 border-blue-500" : "bg-red-50 border-red-500") : !bookingStatus.allowed ? "bg-gray-100 border-gray-300 opacity-60" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="font-bold text-sm text-gray-700 w-24 shrink-0">
                            {slot.label}
                          </div>
                          <div className="flex-1 min-w-0">
                            {isOccupied ? (
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <IconUser />
                                  <span
                                    className={`font-bold truncate ${isMine ? "text-blue-700" : "text-red-700"}`}
                                  >
                                    {reservation.name}
                                  </span>
                                  {isMine && (
                                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full shrink-0">
                                      あなた
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {reservation.resourceId === "laser-plus" && (
                                    <>
                                      <span
                                        className={`text-[10px] px-1.5 rounded border ${reservation.purpose === "laser_only" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-teal-100 text-teal-700 border-teal-200"}`}
                                      >
                                        {reservation.purpose === "laser_only"
                                          ? "レーザーのみ"
                                          : "MEA計測"}
                                      </span>
                                      <span className="text-[10px] px-1.5 rounded border bg-gray-100 text-gray-600 border-gray-200">
                                        {reservation.wavelength || "1480"}
                                        nm
                                      </span>
                                    </>
                                  )}
                                  {reservation.note && (
                                    <span
                                      className="text-gray-400 flex items-center"
                                      title={reservation.note}
                                    >
                                      <IconNote />
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                {!bookingStatus.allowed ? "予約不可" : "空き"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isOccupied ? (
                            isMine && (
                              <button className="text-red-400 hover:text-red-600 p-2">
                                <IconTrash />
                              </button>
                            )
                          ) : !bookingStatus.allowed ? (
                            <IconLock className="text-gray-300" />
                          ) : (
                            <span className="text-2xl text-gray-300 font-light">
                              +
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* モーダル類は省略せずそのまま */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-1 text-gray-800">
              予約: {targetSlot?.label}
            </h3>
            <p className="text-sm text-gray-500 mb-4 pb-2 border-b">
              {dateDisplay} -{" "}
              {RESOURCES.find((r) => r.id === selectedResource)?.name}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                お名前 (苗字)
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="例: 佐藤"
                className="w-full p-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                autoFocus
              />
            </div>
            {selectedResource === "laser-plus" && (
              <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <label className="block text-sm font-bold text-teal-800 mb-2 flex items-center gap-1">
                  <IconLaser /> 詳細設定
                </label>
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-600 mb-1">
                    使用目的
                  </p>
                  <div className="flex gap-2">
                    <label
                      className={`flex-1 py-2 px-1 text-center text-xs rounded border cursor-pointer ${inputPurpose === "mea" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="purpose"
                        value="mea"
                        checked={inputPurpose === "mea"}
                        onChange={(e) => setInputPurpose(e.target.value)}
                        className="hidden"
                      />{" "}
                      MEA計測
                    </label>
                    <label
                      className={`flex-1 py-2 px-1 text-center text-xs rounded border cursor-pointer ${inputPurpose === "laser_only" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="purpose"
                        value="laser_only"
                        checked={inputPurpose === "laser_only"}
                        onChange={(e) => setInputPurpose(e.target.value)}
                        className="hidden"
                      />{" "}
                      レーザーのみ
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-1">波長</p>
                  <div className="flex gap-2">
                    <label
                      className={`flex-1 py-2 px-1 text-center text-xs rounded border cursor-pointer ${inputWavelength === "1480" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="wavelength"
                        value="1480"
                        checked={inputWavelength === "1480"}
                        onChange={(e) => setInputWavelength(e.target.value)}
                        className="hidden"
                      />{" "}
                      1,480 nm
                    </label>
                    <label
                      className={`flex-1 py-2 px-1 text-center text-xs rounded border cursor-pointer ${inputWavelength === "1465" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300"}`}
                    >
                      <input
                        type="radio"
                        name="wavelength"
                        value="1465"
                        checked={inputWavelength === "1465"}
                        onChange={(e) => setInputWavelength(e.target.value)}
                        className="hidden"
                      />{" "}
                      1465 nm
                    </label>
                  </div>
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                備考 (任意)
              </label>
              <textarea
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                placeholder="自由記述欄"
                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 h-20 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={submitReservation}
                className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-md"
              >
                予約する
              </button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center gap-2">
              <IconInfo /> 予約詳細
            </h3>
            <div className="space-y-3 mb-6 text-sm">
              <p>
                <span className="font-bold text-gray-500">日時:</span>{" "}
                {dateDisplay} {targetSlot?.label}
              </p>
              <p>
                <span className="font-bold text-gray-500">予約者:</span>{" "}
                <span className="text-lg font-bold">{deleteTarget.name}</span>
              </p>
              {deleteTarget.resourceId === "laser-plus" && (
                <>
                  <p>
                    <span className="font-bold text-gray-500">目的:</span>{" "}
                    {deleteTarget.purpose === "laser_only"
                      ? "レーザー照射のみ"
                      : "MEA計測"}
                  </p>
                  <p>
                    <span className="font-bold text-gray-500">波長:</span>{" "}
                    {deleteTarget.wavelength || "1480"} nm
                  </p>
                </>
              )}
              {deleteTarget.note && (
                <div className="bg-gray-50 p-2 rounded border">
                  <span className="font-bold text-gray-500 block text-xs mb-1">
                    備考:
                  </span>
                  {deleteTarget.note}
                </div>
              )}
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              {isMyReservation ? (
                <p className="text-red-700 font-bold text-center mb-4">
                  この予約を取り消しますか？
                </p>
              ) : (
                <div className="mb-4">
                  <p className="text-red-700 font-bold text-xs mb-2">
                    管理者として削除する場合のみパスワードを入力
                  </p>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => {
                      setDeletePassword(e.target.value);
                      setDeleteError("");
                    }}
                    placeholder="管理者パスワード"
                    className="w-full p-2 border border-red-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {deleteError && (
                    <p className="text-red-600 text-xs mt-1 font-bold">
                      {deleteError}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50"
                >
                  閉じる
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 shadow-sm"
                >
                  削除する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
