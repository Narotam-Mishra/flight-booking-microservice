
## Some interesting problems to tackle while implementing Flight Booking backend microservice

# Booking Mechanism <== equivalent to ===> Payment Mechanism

1). Same Seat Selection,
2). Single seat selection by two concurrent users,
3). Unhappy Path selection - when user doesn't react the final successful destination. Example - failure while making payment,

# In general, Happy path are very less and non Happy path are relatively more.

# Database Transaction :- In real life situations, we might need to execute a series of queries in order to accomplish a task. We might do a club of CRUD operations. these series of operations can execute a single unit of work and hence these series of operations are called as Database Transaction.

# Database Transaction  <======> Executing series of queries,

# During the transaction execution our database might go through a lot of chnages and can be in an inconsistent intermediate state. There are four transaction capabilities that Database support referred as `ACID` properties.
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

