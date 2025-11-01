

export const FilteredDate = (filter:string)=>{
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(),date.getMonth(),1);
    const lastDayOfMonth = new Date(date.getFullYear(),date.getMonth() + 1,0);

    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate()-date.getDay());
    firstDayOfWeek.setHours(0,0,0,0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate()+ 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    const startDay = new Date(date);
    startDay.setHours(0,0,0,0);

    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);

  let filterType = {};

  if(filter === 'month'){
    filterType = {createdAt:{$gte:firstDayOfMonth,$lte:lastDayOfMonth}};
  }else if(filter === 'day'){
    filterType = {createdAt:{$gte:startDay,$lte:endDay}};
  }else if(filter === 'week'){
    filterType = {createdAt:{$gte:firstDayOfWeek,$lte:lastDayOfWeek}};
  }

  return filterType;
};