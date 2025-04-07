
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

# Isolation - Database isolation defines the degree to which a transaction must be isolated from the data modifications made by any other transaction(even though in reality there can be a large number of concurrently running transactions). The overarching goal is to prevent reads and writes of temporary, aborted, or otherwise incorrect data written by concurrent transactions.

Q. How Isolation is handled in MySQL DB?
# In database, Isolation determines how transaction integrity is visible to other users and systems. A lower isolation level increases the ability of many users to access the same data at the same time, but also increases the number of concurrency effects (such as dirty reads or lost updates) users might encounter. Conversely, a higher isolation level reduces the types of concurrency effects that users may encounter, but requires more system resources and increases the chances that one transaction will block another.

# Dirty Read - A dirty read (aka uncommitted dependency) occurs when a transaction retrieves a row that has been updated by another transaction that is not yet committed.

# Non-repeatable reads :- A non-repeatable read occurs when a transaction retrieves a row twice and that row is updated by another transaction that is committed in between.

# Phantom reads :- A phantom read occurs when a transaction retrieves a set of rows twice and new rows are inserted into or removed from that set by another transaction that is committed in between.

## Isolation levels (from lowest to higest)

1). Read uncommitted :- This is the lowest isolation level. In this level, dirty reads are allowed, so one transaction may see not-yet-committed changes made by other transactions.

# There is almost no isolation on this level,
# It reads the latest uncommited value at every step that can be updated from other uncommited transactions.
# Dirty reads are possible.
# This process will be pretty fast.

2). Read committed :- It is an isolation level that guarantees that any data read is committed at the moment it is read. It simply restricts the reader from seeing any intermediate, uncommitted, 'dirty' read.

# Here Dirty reads are avoided because any uncommited changes are not visible to any other transaction until we commit.

# In this level, each `Select` statement will have its own snapshot of data which can be problematic if we execute same `Select` again because some other transaction might commit and update and we will see new data in the second `Select`

3). Repeatable reads - In this isolation level, a lock-based concurrency control DBMS implementation keeps read and write locks until the end of the transaction.

# A snapshot of select is taken first time it runs during a transaction and same snapshot is used through out the transaction when same select is executed.

# A transaction running at this level doesn't take into account any changes to data made by other transaction.

# But this brings `Phatom Read` problem i.e, a new row can exist in between transaction which was not before.

4). Serializable :- This is the highest isolation level With a lock-based concurrency control DBMS implementation, serializability requires read and write locks to be released at the end of the transaction. 

# It completely isolates the effect of one transaction from others. It is a Repeatable Read with more isolation to avoid `Phantom Read`

# More Info Link1 - https://medium.com/nerd-for-tech/understanding-database-isolation-levels-c4ebcd55c6b9

# Link2 - https://en.wikipedia.org/wiki/Isolation_(database_systems)

Q. How Durability is ensured in MySQL DB?
# The DB should be durable enough to hold all the latest updates even if system fails or restarts.

# If a transaction updates a chunk of data in DB and commits the DB will hold the new data. If transaction commits but system fails before data could be written then data should be written back when system restarts.

## INO DB with MySQL :- It is a storage engine for MYSQL. Storage Engine is a like a interface that exists between DBMS and actual disk (where the data is) and it exists as an interface in between where all the queries used to get executed on the corresponding DB.

# Race Condition :- When two or more different entities try to access the same resource then that is called `Reace Condition`. In order to avoid Race Condition we can do multiple stuffs :-

- we can make our isolation level Serializable
- Locking mechanism using which we can avoid race condition

# Different types of locks :-
1). Shared Lock :- this allows multiple transactions to read data at same time but restricts any of them from writing,

2). Exclusive Lock :- this prevents transactions from reading or writing the same data at same time,

3). Intent lock :- this is used to specify that a transaction is planning to read or write a certain section of data.

4). Row-level Locks :- this allows transaction to lock only a specific row.

# MySQL ---> is a MVCC (Multi Version Concurrency Control) database. This database is compatible to allow multiple transactions to read or write the same data without much conflict.

# Every transaction in MySQL sort of captures the data it is about to modify at start of transaction and writes the changes to an entirely different verison of data. This allows transaction to continue working with original data without conflict.

# In order to handle race condition in Booking system, we can implement two different kind of mechanishms :-
1). Pesimistic Concurrency Control :- In this approach, we try to avoid race condition in a database by locking the data for which we can use locking or isolation level and this ensures us at one point of time only one person is accessing the data which can cause the race condition. To avoid this, one way is to set our transaction `Serializable`. Other ways are :-
- implement row level lock, for example 
select * from table_name where condition for update

2). Optimistic Concurrency Control :- In this approach, we can put manual checks for conflicts before committing the change

# MySQL DB Architecture :- https://chatgpt.com/canvas/shared/67b3183d23448191aecd3ddeade21b4d

# More Details - https://medium.com/@sameersoin/deep-dive-into-data-storage-in-databases-the-innodb-engine-7ec0a55e3886

# Sequelize Transaction : https://sequelize.org/docs/v6/other-topics/transactions/

