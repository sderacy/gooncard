CREATE TABLE "users" (
	"id"	INTEGER NOT NULL UNIQUE,
	"first_name"	TEXT NOT NULL,
	"last_name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"settings"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "user_accounts" (
	"id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"label"	TEXT NOT NULL,
	"value"	TEXT NOT NULL,
	FOREIGN KEY("user_id") REFERENCES "users"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);