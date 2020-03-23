<?php
/**
 * User: Dominic Bourdua
 * Date: 8/1/2019
 * Time: 9:17 AM
 */

class Validation
{
    public function __construct() {
    }


    public function createBranchName($data) {
        $data = $this->_validateAndSanitize($data);

        $ramq = $data["ramq"];
        $registrationCode = $data["code"];

        $nbrArray = [];
        $firebaseBranch = $this->_createRamqString($ramq);

        for ( $pos=0; $pos < strlen($registrationCode); $pos ++ ) {
            $byte = substr($registrationCode, $pos, 1);

            if(is_numeric($byte))
                array_push($nbrArray, intval($byte));
            else
                array_push($nbrArray, $this->_asciiCalculation(ord($byte)));
        }

        $firebaseBranch .= $this->_splitArray($nbrArray);
        return $firebaseBranch;
    }

    protected function _validateAndSanitize($arrayForm) {
        $sanitized = $this->_sanitizeData($arrayForm);
        if (!preg_match(RAMQ_FORMAT, $sanitized["ramq"]) || !preg_match(REGISTRATION_CODE_FORMAT, $sanitized["code"]))
            HelpSetup::returnErrorMessage(HTTP_STATUS_BAD_REQUEST_ERROR);
        $sanitized["ramq"] = strtoupper($sanitized["ramq"]);
        return $sanitized;
    }

    /*
     * Recursive function that sanitize the data
     * @params  array to sanitize
     * @return  array sanitized
     * */
    protected function _sanitizeData($arrayForm) {
        $sanitizedArray = array();
        foreach($arrayForm as $key=>$value) {
            $key = strip_tags($key);
            if(is_array($value))
                $value = $this->_sanitizeData($value);
            else
                $value = strip_tags($value);
            $sanitizedArray[$key] = $value;
        }
        return $sanitizedArray;
    }

    protected function _createRamqString($ramq) {
        $numbers = preg_replace(ANY_NUMBERS, "", $ramq);
        $characters = preg_replace(ANY_LETTERS, "", $ramq);

        return substr($characters, 0, 1) . substr($characters, -1, 1) . (strlen($numbers) % 2 ? substr($numbers, strlen($numbers) / 2, 1) : substr($numbers, (strlen($numbers) /  2) - 1, 2));
    }

    protected function _asciiCalculation($number) {
        $sum = 0;

        while ($number) {
            $sum += $number % 10;
            $number = floor($number / 10);
        }

        if (strlen(strval($sum)) > 1)
            return $this->_asciiCalculation($sum);
        else
            return $sum;
    }

    protected function _splitArray($nbrArray) {
        $oddIndex = [];
        $evenIndex = [];

        for ($i = 0; $i < count($nbrArray); $i++) {
            if ($i % 2 === 0)
                array_push($oddIndex, $nbrArray[$i]);
            else
                array_push($evenIndex, $nbrArray[$i]);
        }
        $sum = intval(implode("", $oddIndex)) + intval(implode("", $evenIndex));
        $lastPart = $this->_splitNumber($sum);
        return ($sum . $lastPart);
    }

    protected function _splitNumber($sumArray) {
        $sumArray = str_split(strval($sumArray));
        $arrayFirstPart = $sumArray;
        $arraySecondPart = array_splice($arrayFirstPart, 0 , ceil(count($arrayFirstPart) / 2));
        return (intval(implode("", $arrayFirstPart)) + intval(implode("", $arraySecondPart)));
    }
}