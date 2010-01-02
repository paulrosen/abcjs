/** 
 * JSONSchema Validator - Validates JavaScript objects using JSON Schemas 
 *	(http://www.json.com/json-schema-proposal/)
 *
 * Copyright (c) 2007 Kris Zyp SitePen (www.sitepen.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
To use the validator call JSONSchema.validate with an instance object and an optional schema object.
If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating), 
that schema will be used to validate and the schema parameter is not necessary (if both exist, 
both validations will occur). 
The validate method will return an array of validation errors. If there are no errors, then an 
empty list will be returned. A validation error will have two properties: 
"property" which indicates which property had the error
"message" which indicates what the error was
 */

/*
 * Paul Rosen changes:
 * various bug fixes
 * additionalProperties defaults to true instead of false
 * array types cannot contain non-numeric properties
 * change enum type to Enum to avoid reserved word.
 * added union type so that enums can specify what other data is in an object.
 * added printout of the object as output.
 * added prohibits, which is the opposite of requires.
 */

JSONSchema = {
	validate : function(/*Any*/instance,/*Object*/schema) {
		// Summary:
		//  	To use the validator call JSONSchema.validate with an instance object and an optional schema object.
		// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating), 
		// 		that schema will be used to validate and the schema parameter is not necessary (if both exist, 
		// 		both validations will occur). 
		// 		The validate method will return an object with two properties:
		// 			valid: A boolean indicating if the instance is valid by the schema
		// 			errors: An array of validation errors. If there are no errors, then an 
		// 					empty list will be returned. A validation error will have two properties: 
		// 						property: which indicates which property had the error
		// 						message: which indicates what the error was
		//
		return this._validate(instance,schema,false);
	},
	checkPropertyChange : function(/*Any*/value,/*Object*/schema, /*String*/ property) {
		// Summary:
		// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
		// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
		// 		not check for self-validation, it is assumed that the passed in value is already internally valid.  
		// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for 
		// 		information.
		//
		return this._validate(value,schema, property || "property");
	},
	_validate : function(/*Any*/instance,/*Object*/schema,/*Boolean*/ _changing) {
	var recursion = -1;
	var errors = [];
	var prettyPrint = [];
	function addPrint(indent, message){
		var str = "";
		for (var i = 0; i < indent; i++)
			str += "\t";
		prettyPrint.push(str + message);
	}

		// validate a value against a property definition
	function checkProp(value, schema, path,i, recursion){
		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}
		
		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function')){
			if(typeof schema == 'function'){
				if(!(value instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i, recursion);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' && 
						(type == 'null' ? value !== null : typeof value != type) && 
						!(value instanceof Array && type == 'array') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type 
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = []; 
					checkProp(value,type,path, recursion);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors; 
				} 
			}
			return [];
		}
		if(value === undefined){
			if(!schema.optional){  
				addError("is missing and it is not optional");
			}
		}else{
			if (schema.type === 'union') {
				var enumField = value[schema.field];
				if (enumField === undefined)
					addError("Expected " + schema.field + " field in " + path);
				else {
					addPrint(recursion, enumField+':');
					var ttFound = false;
					for (var tt = 0; tt < schema.types.length; tt++) {
						if (enumField === schema.types[tt].value) {
							if (schema.types[tt].properties[schema.field] === undefined)	// Don't throw an error when we encounter the original enum field
								schema.types[tt].properties[schema.field] = { type: "string", output: "hidden" };
							errors.concat(checkObj(value,schema.types[tt].properties,path+"."+schema.field+'='+enumField,schema.additionalProperties, recursion+1));
							ttFound = true;
							break;
						}
					}
					if (ttFound === false) {
						addError("Unknown type " + enumField + " in " + path);
					}
				}
			} else
				errors = errors.concat(checkType(schema.type,value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						if(schema.items instanceof Array){
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items[i],path,i, recursion));
							}
						}else{
							for(i=0,l=value.length; i<l; i++){
								if (schema.output !== 'noindex') {
									if (typeof value[i] !== 'object')
										addPrint(recursion+1, (value[i]===null?'null':value[i]));
									else
										addPrint(recursion+1, path + " " + (i+1));
								}
								errors.concat(checkProp(value[i],schema.items,path,i, recursion+1));
							}
						}							
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
					if (schema.additionalProperties !== true) {
						for(i in value){
							if(value.hasOwnProperty(i)) {
								var num = parseInt(i);
								var index = "" + num;
								var isNum = i === index;
								if(!isNum ){
									addError((typeof i) + " The property " + i +
											" is not defined in the schema and the schema does not allow additional properties");
								}
							}
						}
					}
				}else if(schema.properties){
					errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties, recursion+1));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum && 
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum && 
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['Enum']){
					var enumer = schema['Enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError(value + " does not have a value in the enumeration " + enumer.join(", "));
					}
				}

				if(typeof schema.maxDecimal == 'number' && 
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp, recursion){
		
		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){ 
				if(objTypeDef.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_')){
					var value = instance[i];
					var propDef = objTypeDef[i];
					if (propDef.output !== 'hidden' && value !== undefined) {
						if (value === null)
							addPrint(recursion, i+": null");
						else if (typeof value === 'object')
							addPrint(recursion, i+":");
						else
							addPrint(recursion, i+": "+value);
					}
					checkProp(value,propDef,path,i, recursion);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp!==true){
				errors.push({property:path+' '+i,message:(typeof i) + " The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			var prohibits = objTypeDef && objTypeDef[i] && objTypeDef[i].prohibits;
			if(prohibits && (prohibits in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " prohibits " + requires + " from being present"});
			}
			value = instance[i];
			if(objTypeDef && typeof objTypeDef == 'object' && !(i in objTypeDef)){
				checkProp(value,additionalProp,path,i, recursion);
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i, recursion));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '', recursion);
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','', recursion);
	}
	return {valid:!errors.length,errors:errors, output: prettyPrint};
	}
	/* will add this later
	newFromSchema : function() {
	}
*/
}
