const graphql = require('graphql');
const Store = require('../models/store');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const ReviewType = new GraphQLObjectType({
    name: 'Review',
    field: () => ({
        id:                                 { type: GraphQLID },
        content:                            { type: GraphQLString },
        creator:                            { type: GraphQLString },
        createdTime :                       { type: GraphQLString },
        store: {
            type: StoreType,
            resolve(parent, args) {
                return Store.findById(parent.storeId);
            }
        }
    })
});

const StoreType = new GraphQLObjectType({
    name: 'Store',
    fields: () => ({
        id:                                 { type: GraphQLID },
        name:                               { type: GraphQLString },
        description:                        { type: GraphQLString },
        reviews: { 
            type: GraphQLList(ReviewType),
            resolve(parent, args) {
                return Review.find({ storeId: parent.id });
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        store: {
            type: StoreType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                return Store.findById(args.id);
            }
        },
        review: {
            type: ReviewType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
                return Review.findById(args.id);
            }
        },
        stores: {
            type: new GraphQLList(StoreType),
            resolve(parent, args){
                return Store.find({});
            }
        },
        reviews: {
            type: new GraphQLList(ReviewType),
            resolve(parent, args){
                return Review.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addReview: {
            type: ReviewType,
            args: {
                content:                    { type: GraphQLNonNull(GraphQLString) },
                creator:                    { type: GraphQLNonNull(GraphQLInt) },
                createdTime:                { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let review = new Review({
                    content:                args.content,
                    creator:                args.creator,
                    createdTime:            args.createdTime
                })
            }
        },
        addStore: {
            type: StoreType,
            args: {
                name:                       { type: GraphQLNonNull(GraphQLString) },
                description:                { type: GraphQLNonNull(GraphQLString) },
                //likes:                      { type: GraphQLInt},
                //reviews:                    { type: GraphQLList }
            },
            resolve(parent, args) {
                let store = new Store({
                    name:                   args.name,
                    description:            args.description,
                    likes:                  0,
                    reviews:                []
                });
                return store.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});