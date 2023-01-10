<?php
//Regarding the Interfaces, I was meant to split the SenseiManager into two.
//I'm thinking about using a SenseiManagerFactory to handle whether the USER is a Student or a Teacher and have different classes to manage different functions but I think i'll do that later. I'm still learning about Factory implimentation. 

interface Student{
    public function getMySenseisID(): int|null;
    public function setMySenseisIDinDB(Int $id): void;
    public function deleteMySenseisID(int $id): void;
    public function addToMySenseiSkillAmount(int $amount): void;
    public function checkIfRegisteredStudent(): bool;

}

interface Sensei{
    public function getStudentInformation(): array;
    public function addStudentIDS(array $ids): void;
    public function deleteStudentID(int $id): void;
    public function checkIfRegisteredSensei(): bool;
}

?>