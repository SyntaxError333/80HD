from http.server import BaseHTTPRequestHandler
import json
from datetime import date, datetime, timedelta

SUBJECTS = ["Biology", "Physics", "Chemistry", "Psychology"]

def calculate(sessions):
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    next_monday = monday + timedelta(days=7)
    last_monday = monday - timedelta(days=7)

    subject_hours = {s: 0.0 for s in SUBJECTS}
    day_hours = [0.0] * 7  # Monday = 0
    this_week = 0.0
    last_week = 0.0

    for session in sessions:
        try:
            studied = datetime.strptime(session["studied_on"], "%Y-%m-%d").date()
            hours = float(session.get("hours", 0) or 0)
        except (KeyError, TypeError, ValueError):
            continue

        if monday <= studied < next_monday:
            this_week += hours
            subject = session.get("subject")
            if subject in subject_hours:
                subject_hours[subject] += hours
            day_hours[studied.weekday()] += hours
        elif last_monday <= studied < monday:
            last_week += hours

    best = max(day_hours)
    productive_day = (
        ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][day_hours.index(best)]
        if best > 0 else "No sessions yet"
    )
    change = ((this_week-last_week)/last_week*100) if last_week > 0 else (100 if this_week > 0 else 0)

    return {
        "thisWeek": round(this_week, 2),
        "lastWeek": round(last_week, 2),
        "change": round(change, 1),
        "productiveDay": productive_day,
        "subjectHours": {k: round(v, 2) for k, v in subject_hours.items()},
    }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            result = calculate(payload.get("sessions", []))
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as exc:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(exc)}).encode())
