import { describe, expect, test } from 'bun:test'
import { LinkedList } from "./list";

describe('LinkedList', () => {
  describe('constructor', () => {
    test('create empty list', () => {
      const list = new LinkedList()
      expect(list.head).toBeNull()
      expect(list.tail).toBeNull()
      expect(list.size).toBe(0)
      expect(list.current).toBeNull()
    })
  })
  
  describe('append', () => {
    test('create list with one element', () => {
      const list = new LinkedList()
      list.append(1)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(1)
      expect(list.size).toBe(1)
      expect(list.current).toBeNull()
    })

    test('create list with two elements', () => {
      const list = new LinkedList()
      list.append(1)
      list.append(2)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(2)
      expect(list.size).toBe(2)
      expect(list.current).toBeNull()
    })

    test('create list with three elements', () => {
      const list = new LinkedList()
      list.append(1)
      list.append(2)
      list.append(3)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(3)
      expect(list.size).toBe(3)
      expect(list.current).toBeNull()
    })
  })

  describe('prepend', () => {
    test('create list with one element', () => {
      const list = new LinkedList()
      list.prepend(1)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(1)
      expect(list.size).toBe(1)
      expect(list.current).toBeNull()
    })

    test('create list with two elements', () => {
      const list = new LinkedList()
      list.prepend(2)
      list.prepend(1)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(2)
      expect(list.size).toBe(2)
      expect(list.current).toBeNull()
    })

    test('create list with three elements', () => {
      const list = new LinkedList()
      list.prepend(3)
      list.prepend(2)
      list.prepend(1)
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(3)
      expect(list.size).toBe(3)
      expect(list.current).toBeNull()
    })
  })

  describe('from array', () => {
    test('create list from empty array', () => {
      const list = new LinkedList([])
      expect(list.head).toBeNull()
      expect(list.tail).toBeNull()
      expect(list.size).toBe(0)
      expect(list.current).toBeNull()
    })

    test('create list from one element array', () => {
      const list = new LinkedList([1])
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(1)
      expect(list.size).toBe(1)
      expect(list.current).toBeNull()
    })

    test('create list from two elements array', () => {
      const list = new LinkedList([1, 2])
      expect(list.head!.value).toBe(1)
      expect(list.head!.next!.value).toBe(2)
      expect(list.head!.next!.next).toBeNull()
      expect(list.tail!.value).toBe(2)
      expect(list.tail!.prev!.value).toBe(1)
      expect(list.tail!.prev!.prev).toBeNull()
      expect(list.size).toBe(2)
      expect(list.current).toBeNull()
    })

    test('create list from three elements array', () => {
      const list = new LinkedList([1, 2, 3])
      expect(list.head!.value).toBe(1)
      expect(list.tail!.value).toBe(3)
      expect(list.size).toBe(3)
      expect(list.current).toBeNull()
    })
  })

  test('insert element in the middle', () => {
    const list = new LinkedList()
    list.append(1)
    list.append(3)
    list.current = list.head
    list.insertAfterCurrent(2)

    expect(list.head!.prev).toBeNull()
    expect(list.head!.value).toBe(1)
    expect(list.head!.next!.value).toBe(2)
    expect(list.head!.next!.next!.value).toBe(3)
    expect(list.head!.next!.next!.next).toBeNull()

    expect(list.tail!.next).toBeNull()
    expect(list.tail!.value).toBe(3)
    expect(list.tail!.prev!.value).toBe(2)
    expect(list.tail!.prev!.prev!.value).toBe(1)
    expect(list.tail!.prev!.prev!.prev).toBeNull()

    expect(list.size).toBe(3)
  })

  test('insert element at the end', () => {
    const list = new LinkedList()
    list.append(1)
    list.append(2)
    list.current = list.tail
    list.insertAfterCurrent(3)
    expect(list.head!.value).toBe(1)
    expect(list.head!.next!.value).toBe(2)
    expect(list.tail!.value).toBe(3)
    expect(list.size).toBe(3)
  })

  test('insert element at the beginning', () => {
    const list = new LinkedList([2, 3])
    list.current = list.head
    list.insertBeforeCurrent(1)
    expect(list.head!.value).toBe(1)
    expect(list.head!.next!.value).toBe(2)
    expect(list.tail!.value).toBe(3)
    expect(list.size).toBe(3)
  })
})