<?php

namespace App\Console\Commands;

use App\Consts\DatabaseConst;
use Illuminate\Support\Str;

class ModelMakeCommand extends \Illuminate\Foundation\Console\ModelMakeCommand
{
    /**
     * DB purpose
     *
     * @var string
     */
    private string $purpose;

    /**
     * DB connection
     *
     * @var string
     */
    private string $connection;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        [$this->purpose, ] = explode('/', $this->getNameInput());
        $connection = DatabaseConst::CONNECTIONS_EACH_PURPOSE[$this->purpose] ?? null;
        if ($connection === null) {
            $this->error('specify valid directory.');
            return 1;
        }
        $this->connection = $connection;

        parent::handle();
    }

    /**
     * Create a migration file for the model.
     *
     * @return void
     */
    protected function createMigration()
    {
        $table = Str::snake(Str::pluralStudly(class_basename($this->argument('name'))));

        if ($this->option('pivot')) {
            $table = Str::singular($table);
        }

        $this->call('make:migration', [
            'name' => "create_{$table}_table",
            '--create' => $table,
            '--path' => DatabaseConst::MIGRATIONS_BASEPATH . "/{$this->purpose}",
        ]);
    }

    /**
     * Build the class with the given name.
     *
     * @param  string  $name
     * @return string
     *
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    protected function buildClass($name)
    {
        $stub = parent::buildClass($name);

        return str_replace('{{ connection }}', strtoupper($this->connection), $stub);
    }
}
