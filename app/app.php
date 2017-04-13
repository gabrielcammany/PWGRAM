<?php
    use Silex\Application;
    $app = new Application();
    $app = new Silex\Application();
    $app ['app.name'] = 'PwGram';
    /*$app['addClient']= function(){{
        return new \PwGram\Model\Services\SignUp();
    }};*/

    //var_dump( $app['calc']);
return $app;