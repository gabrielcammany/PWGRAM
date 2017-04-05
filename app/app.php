<?php
    use Silex\Application;
    $app = new Application();
    $app = new Silex\Application();
    $app ['app.name'] = 'PwGram';
    $app['calc']= function(){{
        //return new \SilexApp\Model\Services\Calculator();
    }};

    //var_dump( $app['calc']);
return $app;