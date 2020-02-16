// https://www.w3.org/TR/wai-aria-practices/#combobox
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import classNames from 'classnames';
import { useId, useUpdateEffect } from '../utils/hooks';

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESC = 27;
const KEY_ALL = [KEY_UP, KEY_DOWN, KEY_ENTER, KEY_ESC];

const Autocomplete = ({ label, value: initialValue, items, renderItem, itemKey, ...props }) => {
    const [value, setValue] = useState(initialValue || '');
    const [expanded, setExpanded] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const uid = useId();
    const inputId = `input-${uid}`;
    const listboxId = `listbox-${uid}`;
    const optionId = (index) => `${listboxId}-option-${index}`;
    const getHighlightedOptionId = () => (expanded ? optionId(highlighted) : null);
    const highlight = (num) => {
        const max = items.length - 1;
        // eslint-disable-next-line no-nested-ternary
        const index = (num < 0 || num > max)
            ? (num < 0) ? max : 0
            : num;

        setHighlighted(index);
    };
    const clear = () => {
        setValue('');
        setExpanded(false);
        setHighlighted(0);
    };

    useEffect(() => {
        const hasItems = items.length > 0;
        setExpanded(hasItems);
        setHighlighted(hasItems ? highlighted : 0);
    }, [items]);

    useUpdateEffect(() => {
        props.onChange(value);
    }, [value]);

    const onFocus = () => {
        setExpanded(items.length > 0);
    };
    const onBlur = () => {
        setExpanded(false);
        setHighlighted(0);
    };
    const onSelect = (item) => {
        props.onSelect(item);
        onBlur();
    };
    const onChange = ({ target }) => {
        setValue(target.value.trim());
    };
    const onKeyDown = (e) => {
        if (!KEY_ALL.includes(e.keyCode)) return;
        e.preventDefault();

        switch (e.keyCode) {
            case KEY_UP:
                highlight(highlighted - 1);
                break;
            case KEY_DOWN:
                highlight(highlighted + 1);
                break;
            case KEY_ENTER:
                onSelect(items[highlighted]);
                break;
            case KEY_ESC:
                clear();
            // no default
        }
    };

    return (
        <div class="autocomplete">
            { label && <label htmlFor={inputId} class="autocomplete__label">{label}</label> }
            <div
                role="combobox" // eslint-disable-line jsx-a11y/role-has-required-aria-props
                aria-expanded={expanded}
                aria-owns={listboxId}
                aria-haspopup="listbox"
            >
                <input
                    id={inputId}
                    value={value}
                    class="autocomplete__input"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-activedescendant={getHighlightedOptionId()}
                    onInput={onChange}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
            <ul id={listboxId} role="listbox" class="autocomplete__list">
                { items.map((item, i) => (
                    <li
                        key={itemKey(item)}
                        role="option"
                        id={optionId(i)}
                        class={classNames('autocomplete__list-item', { 'is-highlighted': highlighted === i })}
                        aria-selected={highlighted === i ? true : null}
                        onMouseEnter={() => highlight(i)}
                        onMouseDown={() => onSelect(item)}
                    >
                        {renderItem(item)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Autocomplete;
