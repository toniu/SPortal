#!/usr/bin/env bash
set -e
PIDFILE=".http.server.pid"
PORT=${PORT:-8000}
case "$1" in
  start)
    if [ -f "$PIDFILE" ] && kill -0 $(cat "$PIDFILE") 2>/dev/null; then
      echo "Server already running (PID $(cat $PIDFILE))"
      exit 0
    fi
    echo "Starting python http.server on port $PORT..."
    nohup python3 -m http.server "$PORT" > /dev/null 2>&1 &
    echo $! > "$PIDFILE"
    echo "Started (PID $(cat $PIDFILE))"
    ;;
  stop)
    if [ ! -f "$PIDFILE" ]; then echo "No PID file ($PIDFILE) found"; exit 0; fi
    PID=$(cat "$PIDFILE")
    if kill -0 "$PID" 2>/dev/null; then
      echo "Stopping PID $PID"
      kill "$PID"
      sleep 0.2
      if kill -0 "$PID" 2>/dev/null; then
        kill -9 "$PID" || true
      fi
    else
      echo "Process $PID not running"
    fi
    rm -f "$PIDFILE"
    ;;
  status)
    if [ -f "$PIDFILE" ]; then
      PID=$(cat "$PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then echo "Running (PID $PID)"; else echo "PID file exists but process not running"; fi
    else
      echo "Not running"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 2
    ;;
esac
