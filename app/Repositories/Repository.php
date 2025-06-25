<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

abstract class Repository
{
    /**
     * Upsert model.
     *
     * @param Model $model
     * @return void
     */
    public function upsertModel(Model $model): void
    {
        $model->save();
    }
}