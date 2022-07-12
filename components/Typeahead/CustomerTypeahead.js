import { Typeahead } from "react-bootstrap-typeahead";
import React, { useEffect } from "react";

const CustomerTypeahead = ({ items, setSelected, isSubmitting }) => {
  const ref = React.createRef();
  useEffect(() => {
    if (isSubmitting) {
      // @ts-ignore
      ref.current.clear();
    }
  }, [isSubmitting]);
  console.log(items);
  return (
    <>
      <Typeahead
        id="basic-typeahead-single"
        className="typeahead"
        style={{ height: "40px" }}
        labelKey="customer_name"
        onChange={(item) => {
          setSelected(item);
        }}
        options={items}
        paginate={true}
        minLength={1}
        placeholder="customer"
        ref={ref}
      />
    </>
  );
};

export default CustomerTypeahead;
