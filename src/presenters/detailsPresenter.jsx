import { observer } from "mobx-react-lite";
import { DetailsView } from "src/views/detailsView";
import { SuspenseView } from "src/views/suspenseView";

export const Details = observer(function Details(props) {

    const currentMovie = props.model.currentMovie

    const currentDishPromiseState = props.model.currentDishPromiseState;
    // const isDishInMenu = !!props.model.dishes.find(checkDishInMenu)

    function checkDishInMenu(dish){
        return dish.id === props.model.currentDishId;
    }

    function addDishACB() {
        props.model.addToMenu(currentDishPromiseState.data)
    }

    // if (currentDishPromiseState.data) {
        return <DetailsView
            movie = {currentMovie}
            /*
            dishData = {currentDishPromiseState.data}
            guests = {props.model.numberOfGuests}
            isDishInMenu = {isDishInMenu} 
            userWantsToAddDish = {addDishACB}
            */
        />;
    // }
    
    return <SuspenseView
        promise ={currentDishPromiseState.promise}
        error = {currentDishPromiseState.error} 
    />;
})
