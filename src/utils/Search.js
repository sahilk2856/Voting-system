class Search{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
      //*Searching by product title
      search() {
        const keyword = this.queryStr.search
        
          ? "$or":[
            {area:{$regex:this.queryStr.search,$options: "i"}},
            {areaId:{$regex:this.queryStr.search,$options: "i"}},
            {location:{$regex:this.queryStr.search,$options: "i"}},
            {state:{$regex:this.queryStr.search,$options: "i"}},
            {district:{$regex:this.queryStr.search,$options: "i"}}
        ]
          
          
    
        this.query = this.query.find({ ...keyword });
        return this;
      }
    }
  module.exports = Search