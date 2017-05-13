<?php

namespace PwGram\Providers;


use Pimple\Container;
use Pimple\ServiceProviderInterface;

class DefaultParamsServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app){

        $app['defaultParams'] = $app->protect(function($controller) use ($app){
            switch ($controller){
                case 1:
                    return array(
                        'name'     =>$app['app.name'],
                        'username' => $app['session']->get('username'),
                        'img'      => $app['session']->get('img'),
                        'idUser'   => $app['session']->get('id')
                    );
                    break;
            }

        });

    }
}