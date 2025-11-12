import * as React from "react";

const Slider = React.forwardRef(
  (
    {
      className = "",
      min = 0,
      max = 100,
      step = 1,
      value = [0],
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (index, newValue) => {
      const updated = [...localValue];
      updated[index] = Number(newValue);
      setLocalValue(updated);
      if (onValueChange) {
        onValueChange(updated);
      }
    };

    return (
      <div
        className={`relative flex items-center w-full ${className}`}
        ref={ref}
        {...props}
      >
        <div className="relative w-full h-2 bg-secondary rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              right: `${
                100 -
                (((localValue[1] || localValue[0]) - min) / (max - min)) * 100
              }%`,
            }}
          />
          {localValue.map((val, index) => (
            <input
              key={index}
              type="range"
              min={min}
              max={max}
              step={step}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ pointerEvents: "all" }}
            />
          ))}
          {localValue.map((val, index) => (
            <div
              key={`thumb-${index}`}
              className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md -translate-y-1/2 top-1/2 pointer-events-none"
              style={{
                left: `${((val - min) / (max - min)) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
