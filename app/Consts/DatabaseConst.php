<?php

namespace App\Consts;

class DatabaseConst
{
    /**
     * DB purpose user
     */
    public const PURPOSE_USER = 'user';

    /**
     * DB purpose master
     */
    public const PURPOSE_MASTER = 'master';

    /**
     * DB connection MySQL
     */
    public const CONNECTION_MYSQL = 'mysql';

    /**
     * DB connection SQLite
     */
    public const CONNECTION_SQLITE = 'sqlite';

    /**
     * DB connections each purpose
     */
    public const CONNECTIONS_EACH_PURPOSE = [
        self::PURPOSE_USER => self::CONNECTION_MYSQL,
        self::PURPOSE_MASTER => self::CONNECTION_SQLITE,
    ];

    public const MIGRATIONS_BASEPATH = 'database/migrations';
}