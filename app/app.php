<?php
    use Silex\Application;
    $app = new Application();
    $app = new Silex\Application();
    $app ['app.name'] = 'PwGram';
    $app['addClient']= function(){{
        return new \PwGram\Model\Services\registerUser();
    }};

    //var_dump( $app['calc']);
return $app;