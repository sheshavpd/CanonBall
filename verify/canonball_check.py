"""Records one line of evidence for each run of a check.

Mark each check with the example it encodes:

    @example_of("DEC-031#satisfies/2", "Two $60 refunds on one order")
    def test_second_small_refund_goes_to_review(self): ...

When the check runs under `canonball run` or `canonball fault`, a line is appended
to the file named by $CANONBALL_EVIDENCE. Outside canonball, nothing is written.
"""
import datetime
import functools
import json
import os


def example_of(example_id: str, title: str = ""):
    def wrap(fn):
        @functools.wraps(fn)
        def run(*args, **kwargs):
            outcome = "error"
            try:
                result = fn(*args, **kwargs)
                outcome = "passed"
                return result
            except AssertionError:
                outcome = "failed"
                raise
            finally:
                _record(f"{fn.__module__}.{fn.__qualname__}", example_id, outcome)
        run.example_id = example_id
        return run
    return wrap


def _record(check: str, example: str, outcome: str) -> None:
    path = os.environ.get("CANONBALL_EVIDENCE")
    if not path:
        return
    line = {
        "check": check,
        "example": example,
        "outcome": outcome,
        "run": os.environ.get("CANONBALL_RUN", ""),
        "fault": os.environ.get("CANONBALL_FAULT", ""),
        "commit": os.environ.get("CANONBALL_COMMIT", ""),
        "at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
    }
    with open(path, "a") as f:
        f.write(json.dumps(line) + "\n")
