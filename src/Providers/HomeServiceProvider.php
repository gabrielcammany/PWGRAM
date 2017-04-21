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
        $app['home']= $app->protect(function () use ($app){


            return $app['twig']->render('home.twig',array(
                'app' => $app['app.name']

            ));
        });
    }
}