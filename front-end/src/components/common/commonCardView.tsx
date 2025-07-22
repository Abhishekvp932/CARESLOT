import type React from "react";

interface CommonCardView<T> {
    data : T[];
    renderItem : (itme : T)=> React.ReactNode;
    title?:string;
}

export  const CommonCardView = <T,>({data,renderItem,title}:CommonCardView<T>)=>{
     return (
    <div className="md:hidden space-y-4">
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            {title}
          </h2>
        )}
      {data?.map((item, index) => (
        <div key={index} className="border rounded-xl p-4 shadow-sm bg-white">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}