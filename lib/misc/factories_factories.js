"use strict";
/**
 * @module opcua.miscellaneous
 * @class Factory
 * @static
 */

var assert = require("better-assert");
var _ = require("underscore");

var _global_factories = {};
exports.getFactory = function(type_name) {
    return _global_factories[type_name];
};

var registerFactory = function(type_name,constructor) {

    if(exports.getFactory(type_name)) {
        throw new Error(" registerFactory  : " + type_name + " already registered");
    }
    _global_factories[type_name] = constructor;
};
exports.registerFactory = registerFactory;

exports.dump = function() {
    console.log(" dumping registered factories");
    Object.keys(_global_factories).sort().forEach(function(e){
        console.log(" Factory ", e);
    });
    console.log(" done");
};

function callConstructor(constructor) {

    assert(_.isFunction(constructor));

    var factoryFunction = constructor.bind.apply(constructor, arguments);

    return new factoryFunction();
}
exports.callConstructor = callConstructor;


var getConstructor = function (expandedId) {
    if (!(expandedId && (expandedId.value in constructorMap))) {
        console.log( "cannot find constructor for expandedId ".red.bold);
        console.log(expandedId);
    }
    return constructorMap[expandedId.value];
};

exports.constructObject = function (expandedNodeId) {
    var constructor = getConstructor(expandedNodeId);
    if (!constructor) return null;
    return callConstructor(constructor);
};

var constructorMap = {};
function register_class_definition(classname,class_constructor) {

    registerFactory(classname,class_constructor);

    var expandedNodeId =class_constructor.prototype.encodingDefaultBinary;
    if (expandedNodeId.value in constructorMap) {
        throw new Error(" Class " + classname + " with ID " + expandedNodeId +"  already in constructorMap for  " + constructorMap[expandedNodeId.value].name);
    }
    constructorMap[expandedNodeId.value] = class_constructor;
}
exports.register_class_definition = register_class_definition;

