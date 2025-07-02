<?php

namespace Database\Seeders;

use App\Consts\DatabaseConst;
use App\Models\master\Stamina;
use App\Repositories\master\StaminaRepository;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

abstract class Seeder extends \Illuminate\Database\Seeder
{
    /**
     * Model class name
     */
    protected string $modelName;

    /**
     * Repository class name
     */
    protected string $repositoryName;

    /**
     * DB purpose
     */
    protected string $purpose;

    /**DB table
     * 
     */
    protected string $table;

    /**
     * Set properties.
     *
     * @return void
     */
    abstract protected function setProperties(): void;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->setProperties();

        $repository = new $this->repositoryName();

        $filePath = database_path(sprintf('%1s/%2s/%3s.csv', DatabaseConst::DATA_BASEPATH, $this->purpose, $this->table));
        $models = [];
        if (($handle = fopen($filePath, 'r')) !== false) {
            $isFirstRow = true;
            $columnNames = [];
            while (($data = fgetcsv($handle, null, ',')) !== false) {
                if ($isFirstRow) {
                    $columnNames = $data;
                    $isFirstRow = false;
                    continue;
                }

                $attributes = [];
                foreach ($columnNames as $index => $columnName) {
                    $attributes[$columnName] = $data[$index];
                }
                $models[] = new $this->modelName($attributes);
            }

            fclose($handle);
        }

        $repository->upsertModels($models);
    }
}
