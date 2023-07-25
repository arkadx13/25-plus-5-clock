function App() {
  const [timer, setTimer] = React.useState(25 * 60);
  const [session, setSession] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [countdown, setCountdown] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const audio = document.getElementById("beep");

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const formatLengthDisplay = (time) => {
    return Math.floor(time / 60);
  };

  const setTime = (jump, type, time) => {
    if (type === "break") {
      if ((time >= 60 && jump > 0) || (time <= 1 && jump < 0)) {
        return;
      }
      setBreakTime((prev) => prev + jump);
    } else if (type === "session") {
      if ((time >= 60 && jump > 0) || (time <= 1 && jump < 0)) {
        return;
      }
      setSession((prev) => prev + jump);
      if (!countdown) {
        setTimer(session + jump);
      }
    }
  };

  const playAlarm = () => {
    audio.currentTime = 0;
    audio.play();
  };

  const resetAlarm = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  const pausePlay = () => {
    let second = 1000;
    let date;
    let nextDate = new Date().getTime() + second;
    let onBreakTracker = onBreak;

    if (!countdown) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setTimer((prev) => {
            if (prev == 10) {
              playAlarm();
            }
            if (prev <= 0 && !onBreakTracker) {
              onBreakTracker = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakTracker) {
              onBreakTracker = false;
              setOnBreak(false);
              return session;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (countdown) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setCountdown(!countdown);
  };

  const reset = () => {
    setTimer(25 * 60);
    setBreakTime(5 * 60);
    setSession(25 * 60);
    setOnBreak(false);
    setCountdown(false);
    clearInterval(localStorage.getItem("interval-id"));
    resetAlarm();
  };

  return (
    <div className="App">
      <div className="display">
        <h1 className="hero">25 + 5 Clock</h1>
        <h3 id="timer-label">{onBreak ? `"ON BREAK"` : `"ON SESSION"`}</h3>
        <h1 id="time-left">{formatTime(timer)}</h1>
        <div className="control-play">
          <button id="start_stop" onClick={pausePlay}>
            {countdown ? (
              <i className="fa-solid fa-pause"></i>
            ) : (
              <i className="fa-solid fa-circle-play"></i>
            )}
          </button>
          <button id="reset" onClick={reset}>
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
      <div className="break-session-settings">
        <Interval
          title="Break"
          type="break"
          labelId="break-label"
          buttonDownId="break-decrement"
          buttonUpId="break-increment"
          intervalLength="break-length"
          setTime={setTime}
          time={formatLengthDisplay(breakTime)}
        />
        <Interval
          title="Session"
          type="session"
          labelId="session-label"
          buttonDownId="session-decrement"
          buttonUpId="session-increment"
          intervalLength="session-length"
          setTime={setTime}
          time={formatLengthDisplay(session)}
        />
      </div>
    </div>
  );
}

function Interval({
  title,
  type,
  labelId,
  buttonDownId,
  buttonUpId,
  intervalLength,
  setTime,
  time,
}) {
  return (
    <div className="settings">
      <h2 id={labelId}>{title}</h2>
      <div className="settings-btn">
        <button id={buttonDownId} onClick={() => setTime(-60, type, time)}>
          <i className="fa-solid fa-caret-down"></i>
        </button>
        <h3 id={intervalLength}>{time}</h3>
        <button id={buttonUpId} onClick={() => setTime(60, type, time)}>
          <i className="fa-solid fa-caret-up"></i>
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
