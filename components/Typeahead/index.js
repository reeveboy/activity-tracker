import { Typeahead } from "react-bootstrap-typeahead";
import React, { useEffect } from "react";

const CustomerTypeahead = ({
  items,
  setSelected,
  isSubmitting,
  field,
  placeholder,
  len,
}) => {
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
        id={`${field}-typeahead`}
        className="typeahead"
        style={{ height: "40px", width: "100%", marginTop: "1rem" }}
        labelKey={field}
        onChange={(item) => {
          setSelected(item);
        }}
        options={items}
        paginate={true}
        minLength={len}
        placeholder={placeholder}
        ref={ref}
      />
    </>
  );
};

export default CustomerTypeahead;
