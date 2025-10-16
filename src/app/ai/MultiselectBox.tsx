// So this a custom made form input for multiselect, made mainly because we did not find something in shadcn that would look like this, and also a great way to learn deeper about how user-form-hook and Form wooks.

import { PanelTopOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  value: string[] | undefined; // The selected items
  data?: string[]; // The data to show
  values?: string[];
  id?: string;
  onChange: (v: string[]) => void; // i guess my component just runs it?
  onBlur?: () => void; // In this case i guess show the dropdownlist?
  dropdownVisible?: boolean; // I am imagining that we also want to be able to show the dropdownlist from outside or get if it is visible, so why not?
  disabled?: boolean;
  width?: string;
  maxWidth?: string;
  containerClassName?: string;
  textfieldClassName?: string;
  buttonClassName?: string;
  buttonSymbol?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  placeholder?: string;
  checkAll?: boolean;
  preValues?: string[];
  adder: boolean;
}

export default function MultiselectWithAdd({
  value,
  data = [],
  values = [],
  onChange,
  onBlur,
  dropdownVisible = false,
  disabled,
  width,
  maxWidth,
  containerClassName,
  textfieldClassName,
  dropdownClassName,
  placeholder,
  id,
  preValues,
  adder,
}: Props) {
  //console.log("Component received value:", value);
  //console.log("Component received data:", data);
  //console.log("Component received values:", values);

  //console.log("Component received preValues:", preValues);

  const [dropDown, setDropDown] = useState(dropdownVisible);
  const [PV, setPV] = useState<boolean>(false);

  useEffect(() => {
    if (!PV && preValues) {
      onChange(preValues);
      setPV(true);
    }
  }, [PV, preValues, onChange]);

  useEffect(() => {
    // What did i want to do here?
  }, [dropDown]);

  if (disabled)
    return (
      <div
        id={id}
        className={containerClassName + " " + width + " " + maxWidth}
      >
        <input className="hidden" id={id} />
        {placeholder}
      </div>
    );

  return (
    <div id={id} className="cursor-pointer">
      <div id="adder" className="w-full p-2 bg-blue-200">
        Adder
      </div>
      <input className="hidden" id={id} />
      <div
        id="container"
        className={"md:flex border-2 rounded-[5px] gap-2 " + containerClassName}
      >
        <div
          id="dropButton"
          onClick={() => setDropDown((prev) => !prev)}
          className="w-9 h-9 select-none cursor-pointer hover:text-accent-foreground hover:bg-accent "
        >
          <PanelTopOpen className="w-9 h-9" />
        </div>

        <div
          id="textfield"
          onClick={() => setDropDown(false)}
          className={
            "select-none w-full justify-baseline min-w-0 max-w-full md:flex md:flex-wrap md:gap-2" +
            textfieldClassName
          }
        >
          {value?.join("") == "" || !value ? (
            <div className="text-sm md:my-1 mx-2 rounded-[6px] flex items-center">
              <span className="w-fit p-1 italic text-gray-400">
                {placeholder}
              </span>
            </div>
          ) : (
            value.map((vv) => (
              <div
                key={vv}
                className="text-sm md:my-1 mx-2 bg-accent text-accent-foreground rounded-[6px] flex items-center gap-2 hover:bg-red-800 hover:text-white"
                onClick={() => {
                  onChange(value.filter((vvv) => vvv != vv));
                }}
              >
                <span className="w-full p-1">
                  {values.length == data?.length
                    ? values[data.findIndex((vvv) => vvv === vv)]
                    : vv}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {dropDown && (
        <div
          id="dropdown"
          onBlur={() => {
            setDropDown(false);
            if (onBlur) onBlur();
          }}
          className={
            "bg-secondary md:max-h-2/3 w-auto md:overflow-y-scroll md:absolute " +
            dropdownClassName
          }
        >
          {data?.map((v, i) => (
            <div
              className={"border-2 min-h-10 flex items-center pr-10 "}
              key={i}
              onClick={() => {
                const newVal = value
                  ? value.includes(v)
                    ? value.filter((val) => val !== v) // Remove it from the value-list.
                    : [...value, v]
                  : [v]; // adds it to the value list.
                onChange(newVal); // So we are calling the controllers function here to update the value
              }}
            >
              <div className="ml-2 border-2 border-green-800 rounded-[5px] select-none">
                <div className="w-5 h-5">
                  {[...(value ?? [])].includes(v) && (
                    <div className="w-5 h-5 bg-green-500 border-1 rounded-[5px] "></div>
                  )}
                </div>
              </div>

              <div className="p-1 ml-1 w-full text-secondary-foreground select-none hover:font-bold">
                {values.length == data.length ? values[i] : v}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
