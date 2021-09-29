class APIFeatures {
    constructor(mongooseQuery, reqQuery)
    { 
        this.query = mongooseQuery;
        this.reqQuery =  reqQuery;
    }
    filter () {
        const queryObj = {...this.reqQuery};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query.find(JSON.parse(queryStr));
        //this.query.filter(queryObj);

        return this;
    }
    sort() {
        if (this.reqQuery.sort) {
    
            this.query.sort((this.reqQuery.sort).split(',').join(' '));
        } else {
            this.query.sort('name');
        }
        return this;
    }
    select () {
        if (this.reqQuery.fields) {
            console.log(this.reqQuery.fields);
            this.query.select((this.reqQuery.fields).split(',').join(' '));
        } else {
            this.query.select('-addOns');
        }
        return this;
    }
    paginate () {
        const page = this.reqQuery.page || 1;
        const limit =  this.reqQuery.limit * 1   || 100;

        this.query.skip((page-1)* limit).limit(limit);
        
        return this;
    }
}

module.exports = APIFeatures; 