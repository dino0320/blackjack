<?php

namespace App\Repositories\user;

use App\Consts\RankingConst;
use App\Models\user\User;
use App\Repositories\Repository;
use Illuminate\Support\Collection;

class UserRepository extends Repository
{
    /**
     * Model class name
     */
    protected string $modelName = User::class;

    public function selectRanking(): Collection
    {
        return User::orderBy('high_score', 'desc')->limit(RankingConst::RANKING_RANGE)->get();
    }
}