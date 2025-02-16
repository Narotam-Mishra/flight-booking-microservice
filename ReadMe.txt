
## Some interesting problems to tackle while implementing Flight Booking backend microservice

# Booking Mechanism <== equivalent to ===> Payment Mechanism

1). Same Seat Selection,
2). Single seat selection by two concurrent users,
3). Unhappy Path selection - when user doesn't reach the final successful destination. Example - failure while making payment,

# In general, Happy path are very less and non Happy path are relatively more.

# Database Transaction :- In real life situations, we might need to execute a series of queries in order to accomplish a task. We might do a club of CRUD operations. These series of operations can execute a single unit of work and hence these series of operations are called as Database Transaction.

# Database Transaction  <======> Executing series of queries,

# During the transaction execution our database might go through a lot of changes and can be in an inconsistent intermediate state. There are four transaction capabilities that Database support referred as `ACID` properties.
# A ---> Atomicity,
# C ---> Consistency,
# I ---> Isolation,
# D ---> Durability,

# Atomicity :- A transaction is a bundle of statements that intends to achieve one final state. When we are attempting a transaction, we either want to complete all the statements or none of them. We never want an intermediate state. This is called as Atomicity.

# States of Transaction :- 
1). Begin :- when transaction just start,
2). Commit :- all the changes are applied successfully,
3). Rollback - something happened in between & then whatever changes were successful will be reverted.

# Consistency :- Data stored in a DB is always valid and in a consistent state

# Isolation :- It is an ability of multiple transactions to execute without interferring with one another.

# Durability :- If something changed in the database and any unforseen circumstances happened then our changes should persist.

# In simple words, Transaction is a sequence of read & write operations that are going to occur.

# In CRUD ---> CUD ----> is a Write operation & R ---> is a Read operation,

# Example of Transaction :- Bank Money transfer between two persons `A` & `B`

# Serial Execution :- When one transaction goes through then only the other transaction can start.

# Problems with Serial Execution :-
1). No usage of CPU multi core,
2). slow execution of queries,

# Execution Anomalies - Execution anomalies in databases refer to unexpected or unintended behaviors that occur during the execution of database transactions. These anomalies can arise due to various reasons, such as concurrency issues, improper transaction management, or system failures. Different types of Execution Anomalies are :-
1). Read-Write conflict
2). Write-Read conflict
3). Write-Write conflict

1). Read-Write conflict :- A Read-Write conflict in a database occurs when one transaction is reading data while another transaction is writing to the same data simultaneously. This can lead to inconsistencies and unexpected results. This happens when a transaction reads data that another transaction is in the process of modifying. If the reading transaction relies on the data being consistent, it might make incorrect decisions based on the uncommitted changes.
Example :-
==> Transaction A reads a value from the database.
==> Transaction B writes a new value to the same data.
==> If Transaction A reads the data before Transaction B commits its changes, Transaction A might get an outdated or inconsistent view of the data.

2). Write-Read conflict / Dirty Read :- A Write-Read conflict, also known as an uncommitted dependency or dirty read, occurs in a database when a transaction reads data that has been written by another transaction that has not yet been committed. This can lead to inconsistencies and unreliable data because the uncommitted changes might be rolled back, leaving the reading transaction with incorrect or non-existent data.
Example Scenario :-
==> Transaction A writes a value to a record.
==> Transaction B reads the value written by Transaction ==> A before Transaction A commits.
==> Transaction A rolls back its changes.
==> Transaction B now has read a value that never actually existed in the committed state of the database.

3). Write-Write conflict / Overwriting uncomitted data :- A Write-Write conflict, also known as a "lost update" problem, occurs in database systems when two or more transactions attempt to write to the same data item simultaneously. This can lead to inconsistencies because the final value of the data item will be determined by the last write operation, potentially overwriting the changes made by other transactions.
Example Scenario :-
==> Consider two transactions, T1 and T2, both trying to update the same data item X:
==> Transaction T1 reads the value of X.
==> Transaction T2 reads the value of X.
==> Transaction T1 writes a new value to X.
==> Transaction T2 writes a new value to X.
==> In this case, the update made by T1 is lost because T2 overwrites it.

# INO DB with MySQL :- It is a storage engine for MYSQL. Storage Engine is a like a interface that exists between DBMS and actual diask (where the data is) and it exists as an interface in between where all the queries used to get executed on the corresponding DB.

Q. How Database ensure Atomicity?
# There are two ways in which Database ensure Atomicity :-
1). Logging :- In the process the DBMS logs all the actions that it is doing so that later it can undo it. These logs can be maintained in memory or disk.

2). Shadow Paging :- In this process, the DBMS makes copies of actions (transactions) and then this copy is initially considered as a temporary copy. If transaction succeeds then it starts pointing to the new temporary copies.

# Among above two techniques `Logging` is the most preferred one.

# Atomicity for MYSQL DB :- 
- After each `Commit` or `Rollback` database remains in a consistent state.
- In order to handle `Rollback`, there different mechanisms and they are :- 1). Undo Log, 2). Redo Log

1). Undo Log :- This log contains records about how to undo the last change done by a transaction. If any other transaction need the original data as a part of consitent read operation, the unmodified data is retrieved from undo log.

2). Redo Log :- By definition, the redo log is a disk based data structure used for crash recovery to correct data written by `Incomplete Transaction`. The changes which could make it upto the data files before the crash or any other reasons are replayed automatically during the restart of server after crash. 