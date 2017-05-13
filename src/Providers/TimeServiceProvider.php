<?php

namespace PwGram\Providers;


use Pimple\Container;
use Pimple\ServiceProviderInterface;

class TimeServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app){

        $app['time'] = $app->protect(function($date) use ($app){
            $datetime1 = new \DateTime();
            $datetime2 = new \DateTime($date);
            $interval = $datetime1->diff($datetime2);
            $sec = $interval->format('%s');
            $min = $interval->format('%i');
            $hours = $interval->format('%h');
            $days = $interval->format('%a');
            $result = "Ahora";
            if($days >= 1){
                if($days == 1){
                    $result = $interval->format('%a día');
                }else{
                    $result = $interval->format('%a días');
                }
            }else if($hours >= 1){
                if($hours == 1){
                    $result = $interval->format('%h hora');
                }else{
                    $result = $interval->format('%h horas');
                }
            }else if($min >= 1){
                if($min == 1){
                    $result = $interval->format('%i minuto');
                }else{
                    $result = $interval->format('%i minutos');
                }
            }else if($sec >= 1){
                if($sec == 1){
                    $result = $interval->format('%s segundo');
                }else{
                    $result = $interval->format('%s segundos');
                }
            }
            return $result;
        });

    }
}