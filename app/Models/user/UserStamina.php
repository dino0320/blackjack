<?php

namespace App\Models\user;

use App\Consts\DatabaseConst;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStamina extends Model
{
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'user_stamina_id';

    /**
     * The database connection that should be used by the model.
     *
     * @var string
     */
    protected $connection = DatabaseConst::CONNECTION_MYSQL;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'stamina_id',
        'point',
        'last_updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_updated_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the user_stamina.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
