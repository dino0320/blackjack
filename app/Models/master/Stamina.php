<?php

namespace App\Models\master;

use App\Consts\DatabaseConst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stamina extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'stamina_id';

    /**
     * The database connection that should be used by the model.
     *
     * @var string
     */
    protected $connection = DatabaseConst::CONNECTION_SQLITE;
}
