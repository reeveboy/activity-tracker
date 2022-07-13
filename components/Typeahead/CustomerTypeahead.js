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
  return (
    <>
      <Typeahead
        id="customer-typeahead"
        className="typeahead"
        style={{ height: "40px", width: "300px", marginTop: "1rem" }}
        labelKey="customerName"
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
