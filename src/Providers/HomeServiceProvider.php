<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 10/04/2017
 * Time: 11:41
 */

namespace PwGram\Providers;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

class HomeServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app){
        $app['home']= $app->protect(function ($name) use ($app){
            $default =  $app['hello.default_name'] ? $app['hello.default_name']:'';
            $name = $name ?: $default;

            return $app['twig']->render('home.twig',array(
                'user' => $name,
                'app' => [
                    'name'=> $app['app.name']
                ]
            ));
        });
    }
}