<?php
/**
 * Created by PhpStorm.
 * User: Xps_Sam
 * Date: 16/04/2017
 * Time: 19:20
 */

namespace PwGram\Model;


class upload
{
    private $request;
    private $status=0;

    public function __construct($request)
    {
        $this->request = $request;
        return $this;
    }
    public function saveImage()
    {
        if (!empty($_POST['myData'])) {
            $img_data=$_POST['myData'];
            $img = $this->base64_to_jpeg($img_data, 'preview.jpg');
            rename('preview.jpg','assets/img/uploads/preview.jpg');
        }
        return 1;
    }


    function base64_to_jpeg($base64_string, $output_file) {
        $ifp = fopen($output_file, "wb");
        //echo '\n\n'.$base64_string.'\n';
        $data = explode(',', $base64_string);

        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        return $output_file;
    }
}