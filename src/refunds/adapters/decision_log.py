"""The decision log: one JSON line per decision. Fields are listed in observe/signals.md."""
from __future__ import annotations

import datetime as dt
import json
import threading
from pathlib import Path

from refunds.decide import Decision


class DecisionLog:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self._lock = threading.Lock()

    def write(self, order_id: int, decision: Decision, trace: str) -> None:
        line = {
            "order": order_id,
            "clause": decision.clause,
            "result": decision.result,
            "reason": decision.reason,
            "inputs": decision.inputs,
            "trace": trace,
            "at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        }
        with self._lock:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            with self.path.open("a") as f:
                f.write(json.dumps(line) + "\n")
