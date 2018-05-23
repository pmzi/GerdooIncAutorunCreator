// Interface for loading

class ILoading{

    showGeneral(){
        throw new Error("Show General Loadings Should Be Override.");
    }

    hideAll(){
        throw new Error("Hide All Loadings Should Be Override.");
    }

}

module.exports = ILoading;