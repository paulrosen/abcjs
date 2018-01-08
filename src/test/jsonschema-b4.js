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
 * added stringorarray, which allows either a string, or the array specified.
 * added stringorinteger, which allows either a string or an integer.
 */

var JSONSchema = {
	validate : function(/*Any*/instance,/*Object*/schema) {
		"use strict";
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
	_validate : function(/*Any*/instance,/*Object*/schema,/*Boolean*/ _changing) {
		"use strict";
	var recursion = -1;
	var errors = [];
	var prettyPrint = [];
	function addPrint(indent, message){
		var str = "";
		for (var i = 0; i < indent; i++)
			str += "\t";
		prettyPrint.push(str + message);
	}
	function appendPrint(message){
		if (prettyPrint.length > 0)
			prettyPrint[prettyPrint.length-1] += " " + message;
	}

		// validate a value against a property definition
	function checkProp(value, schema, path,i, recursion){
		var l;
		path += path ? typeof i === 'number' ? '[' + i + ']' : typeof i === 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}
		
		if((typeof schema !== 'object' || schema instanceof Array) && (path || typeof schema !== 'function')){
			if(typeof schema === 'function'){
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
				if(typeof type === 'string' && type !== 'any' &&
						(type === 'null' ? value !== null : typeof value !== type) &&
						!(value instanceof Array && type === 'array') &&
						!(type === 'integer' && value%1===0) &&
						!(type === 'string' && typeof value === 'string') &&
						!(type === 'stringorinteger' && (typeof value === 'string' || value%1===0)) &&
						!(type === 'stringorarray' && (typeof value === 'string' || value instanceof Array))
				){
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
				}else if(typeof type === 'object'){
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
							var thisRecursion = (recursion===0)?1:recursion;	// TODO-PER-HACK: Not sure why the first case is different. Figure it out someday.
							for(i=0,l=value.length; i<l; i++){
								var nextRecursion = recursion;
								if (schema.output !== 'noindex') {
									nextRecursion++;
									if (typeof value[i] !== 'object') {
										if (schema.output === 'join')
											appendPrint(value[i]===null?'null':value[i]);
										else
											addPrint(thisRecursion, (value[i]===null?'null':value[i]));
									}
									else
										addPrint(thisRecursion, path.substring(path.lastIndexOf('.')+1) + " " + (i+1));
								}
								errors.concat(checkProp(value[i],schema.items,path,i, nextRecursion));
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
							if(value.hasOwnProperty(i) && typeof value[i] !== 'function') {
								var num = parseInt(i);
								var index = "" + num;
								var isNum = i === index;
								if(!isNum ){
									addError((typeof value[i]) + " The property " + i +
											" is not defined in the schema and the schema does not allow additional properties");
								}
							}
						}
					}
				}else if(schema.properties){
					errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties, recursion+1));
				}
				if(schema.pattern && typeof value === 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value === 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value === 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value === typeof schema.minimum &&
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value === typeof schema.maximum &&
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema.Enum){
					var enumer = schema.Enum;
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

				if(typeof schema.maxDecimal === 'number' &&
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}

	function checkAllProps(instance,objTypeDef,path,recursion) {
		for(var i in objTypeDef){
			if(objTypeDef.hasOwnProperty(i)){
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

	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp, recursion){

		checkAllProps(instance,objTypeDef,path,recursion);
		
		for(var i in instance){
			if(instance.hasOwnProperty(i) && typeof instance[i] !== 'function') {
				if (objTypeDef[i]) {
					var requires = objTypeDef[i].requires;
					if(requires && !(requires in instance)){
						errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
					}
					var prohibits = objTypeDef[i].prohibits;
					if(prohibits && (prohibits in instance)){
						errors.push({property:path,message:"the presence of the property " + i + " prohibits " + requires + " from being present"});
					}
					var value = instance[i];
					if(!(i in objTypeDef)){
						checkProp(value,additionalProp,path,i, recursion);
					}
					if(!_changing && value && value.$schema){
						errors = errors.concat(checkProp(value,value.$schema,path,i, recursion));
					}
				} else if (additionalProp!==true){
				errors.push({property:path+' '+i,message:(typeof instance[i]) + " The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
				}
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
};

module.exports = JSONSchema;
