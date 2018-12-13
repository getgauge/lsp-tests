Tag completion
==============

tags: no-lang-runner

* open project "data/codecomplete"

Tag list for codecomplete
-------------------------
* open file "/$specs/someTags/tagCompletion.spec"
* codecomplete in "/$specs/someTags/tagCompletion.spec" for subText "" at line "4" character "15" should give "tags" 

   |label         |
   |--------------|
   |next line1    |
   |next line2    |
   |ScenarioLevel1|
   |ScenarioLevel2|
   |specLevel     |
   |SpecLevel1    |
   |SpecLevel2    |
   |with space    |

___
* close the project