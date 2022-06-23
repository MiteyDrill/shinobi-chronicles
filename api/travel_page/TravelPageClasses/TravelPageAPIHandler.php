<?php

/* 
File: 		TravelPageAPIHandler.php
Coder:		Cextra
Created:	6/18/2022
Revised:	6/18/2022 by Cextra
Purpose:	Initial API/JSON response handler class for the Travel Page
*/

/**Class handles basic API calls and responses
 * 
 * @param User $player
 * @param System $system
 */
abstract class TravelPageAPIHandler
{

    const GET_METHOD_USED = "GET";
    const POST_METHOD_USED = "POST";

    private $methodUsed = self::GET_METHOD_USED;

    //general containers
    protected array $errors = [];
    protected array $response_data = []; 
    protected array $current_user_data = [];

    /** FUNCTIONS **/

    public function pushError(String $error, String $key = ''){
        //Keys being overwritten could cause issue in the future...
        // ($key === '') ? $key = count($this->errors) : $key = $key; //if no key set increment | otherwise overwrite old key 
        $this->errors[] = $error;
    }


    //TODO: Logic here could cause key overwrites and like lots of errors at some point
    //There should be a better way of doing this
    public function addData(Mixed $data, String $array_key): void{

        if(array_key_exists($array_key, $this->response_data)){
            $this->response_data[$array_key] = $data;
            $this->errors[] = "Key was written over, please check for any errors";
            return;
        }

        $this->response_data[$array_key] = $data;
    }
    
    /** FUNCTIONS **/

    //GET | SET
    private function getMethodUsed(){
        return $this->methodUsed;
    }
    public function setMethodUsed(string $method){
        $this->methodUsed = $method;
    }

    private function getErrors(){
        return $this->errors;
    }
    public function addError(string $error){
        $this->errors[] = $error;
    }


    public function JSON_RESPONSE()
    {
        /*Not Sure if the Access-Control headers actually do anything?*/
        header('Access-Control-Allow-Origin: https://shinobichronicles.com/');
        header('Access-Control-Allow-Credentials: true');
        header('Content-Type: application/json');

        $json = array(

            'method' => $this->getMethodUsed(),
            'response' => $this->response_data,

            'errors' => $this->getErrors()

        );

        echo json_encode($json);
    }
};

?>