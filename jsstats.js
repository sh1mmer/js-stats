/*
* 
* Software License Agreement (BSD License)
* Copyright (c) 2009, Tom Hughes-Croucher
* All rights reserved.
* 
* Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* 
*     * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
*     * Neither the name of Tom Hughes-Croucher nor the names of any contributors may be used to endorse or promote products derived from this software without specific prior written permission of Tom Hughes-Croucher
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
*/


movingAverage = {
    /*
    * Calculate the cumulative moving average 
    * of some data with a given run size
    *
    * data - array of data points
    * run - the number of data points to average across
    */
    cumulative : function(data, run, weight) {
		if (!weight) {
			weight = 1;
		}
        avgData = [];
        
        for(var i=run-1;i<data.length;i++) {
            runningAvg = 0;
        
            for(var j=0;j<run;j++) {
                runningAvg += weight * data[i-j];
            }
        
            avgData[i] = runningAvg/run;
        }
        
        return avgData;
    },
    
    /*
    * Calculate the exponential moving average 
    * of some data with a given run size
    *
    * data - array of data points
    * factor - smoothing factor used 
    */
    exponential : function(data, factor) {
        avgData = [];
        //set first average to first data item as seed
        avgData[0] = data[0];
        
        //start at 1 since we can't average the first result
        for(var i=1;i<data.length;i++) {
            avgData[i] = factor * data[i] + (1 - factor) * avgData[i-1];
        }
        
        return avgData;
    }
};

standardDeviation = {
	/*
	* Calculate the standard deviation
	*/
    calculateSD : function(data) {
        
        //Step 1 Calculate the mean
        mean = this.calculateMean(data);

        //Step 2 Calculate the deviation for each item with the mena
        deviations = this.calculateDeviations(data, mean);

        //Step 3 Square the deviations
        sqDeviations = this.squareArray(deviations);

        //Step 4 Sum the Squares of the deviations
        total = this.arraySum(sqDeviations);

        //Step 5 Calculate the standard deviation
        stdDev = Math.sqrt(total/(sqDeviations.length-1));
        
        return stdDev;
        
    },
    
	calculateMean : function(data) {
		mean = this.arraySum(data)/data.length;
		return mean;
	},

    /*
    * Adapted from http://www.gscottolson.com/weblog/2007/12/09/sum-array-prototype-for-javascript/
    * I'm not a big fan of messing with the Prototypes of default objects so here is that sum 
    * method as a stand-alone function
    */
    arraySum : function(inputArray) {
          return (! inputArray.length) ? 0 : this.arraySum(inputArray.slice(1)) +
              ((typeof inputArray[0] == 'number') ? inputArray[0] : 0);  
    },

    /*
    * Calculate the deviations for each array element
    * I should possibly implement this with slice, as above, once I profile which is more efficient
    */
    calculateDeviations : function(inputArray, mean) {
        for(var i=0;i<inputArray.length;i++) {
            inputArray[i] -= mean;
        }
        return inputArray;
    },
    
    /*
    * Calculate the square for each array element
    * I should possibly implement this with slice, as above, once I profile which is more efficient
    */
    squareArray : function(inputArray) {
        for(var i=0;i<inputArray.length;i++) {
            inputArray[i] *= inputArray[i];
        }        
        return inputArray;
    }
};

/*

Depricating this idea in favour of the student's T-distribution (which is better for small samples)

normalDistribution = {
    /*
    * Calculates a Y vaule on the standard distribution for a given X
    *
    * TODO
    * the variables in this method are ridiculous
    * I really need to fix them
    */
/*
    calculateY : function(x, sd, mean) {
        divisor = sd * Math.sqrt(2 * Math.PI);
        power = -0.5*( ( (x - mean) / sd) * ( (x - mean) / sd) )
        multiplier = Math.E ^ power;
        y = (1/divisor) * multiplier;
        
        return y;
    },

	plotY: function(x, sd, mean, range) {
	    val = Math.sin( ( (x*Math.PI) - mean) / range );
		val = val * val;
		val = val * sd;
		return val;
	}

};
*/