<?php

namespace App\Console\Commands;

use App\Consts\DatabaseConst;

class SeederMakeCommand extends \Illuminate\Database\Console\Seeds\SeederMakeCommand
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        [$purpose, ] = explode('/', $this->getNameInput());
        $connection = DatabaseConst::CONNECTIONS_EACH_PURPOSE[$purpose] ?? null;
        if ($connection === null) {
            $this->error('specify valid directory.');
            return 1;
        }

        parent::handle();
    }
}
