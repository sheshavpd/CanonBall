# Architecture

How the system is divided, where state lives, and the design decisions that are not in the canon.
Agents keep this page current and record each choice with its reason. A person may promote any choice here
to a decision in the canon.

Recommended: keep the code that decides (decision logic, no side effects) apart from the code that acts
(adapters that touch a database, a network or a clock). Logic with no side effects can be checked for every
input, and every decision it makes can be logged with the clause it applied.
