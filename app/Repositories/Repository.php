<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

abstract class Repository
{
    /**
     * Model class name
     */
    protected string $modelName;

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

    /**
     * Insert models.
     *
     * @param Model[] $models
     * @return void
     */
    public function upsertModels(array $models): void
    {
        $values = $update = [];
        foreach ($models as $model) {
            $attributes = $model->getAttributes();
            unset($attributes[$model->getCreatedAtColumn()], $attributes[$model->getUpdatedAtColumn()]);
            $values[] = $attributes;
            $update = array_merge($update, $model->getDirty());
        }

        $update = $update === [] ? null : array_keys($update);
        $this->modelName::upsert($values, [(new $this->modelName)->getKeyName()], $update);
    }
}