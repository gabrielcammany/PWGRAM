<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 29/03/2017
 * Time: 19:09
 */

$app->register(new Silex\Provider\TwigServiceProvider(),array(
    'twig.path' => __DIR__.'/../../src/View/templates',
));
$app->register(new Silex\Provider\AssetServiceProvider(),array(
   'assets.version'=>'v1',
    'assets.version_format'=>'%s?version=%s',
    'assets.named_packages'=>array(
        'css'=>array('base_path'=>'/assets/css'),
        'js'=>array('base_path'=>'/assets/js'),
        'img'=>array('base_urls'=>array('http://silexapp.dev/assets/img')),
    ),
));
$app->register(new PwGram\Providers\HelloServiceProvider(),array(
    'hello.default_name' => 'Samuel',
));
$app->register(new PwGram\Providers\HomeServiceProvider(),array(
    'home.default_name' => 'Samuel',
));

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\DoctrineServiceProvider(),array(
    'db.options' => array(
        'driver' => 'pdo_mysql',
        'dbname' => 'pwgram',
        'user' => 'root',
        'password' => 'gabriel'
    ),
));
