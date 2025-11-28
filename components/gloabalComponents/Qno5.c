#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct {
    int accountNumber;
    double balance;
    pthread_mutex_t lock;   // Mutex to protect this account
} Account;

Account accounts[10];

void *withdraw(void *p) {
    int accountId = *(int *)p;
    double amount = 100;  // Withdraw amount

    // Lock the account before modifying it
    pthread_mutex_lock(&accounts[accountId].lock);

    accounts[accountId].balance -= amount;

    pthread_mutex_unlock(&accounts[accountId].lock);
    return NULL;
}

void *deposit(void *p) {
    int accountId = *(int *)p;
    double amount = 100;  // Deposit amount

    pthread_mutex_lock(&accounts[accountId].lock);

    accounts[accountId].balance += amount;

    pthread_mutex_unlock(&accounts[accountId].lock);
    return NULL;
}

int main() {
    pthread_t threads[20];
    int ids[10];

    // Initialize accounts and their mutexes
    for (int i = 0; i < 10; i++) {
        accounts[i].accountNumber = i;
        accounts[i].balance = 1000; // Starting balance
        pthread_mutex_init(&accounts[i].lock, NULL);
    }

    // Create multiple threads to simulate transactions
    for (int i = 0; i < 10; i++) {
        ids[i] = i;
        pthread_create(&threads[i], NULL, withdraw, &ids[i]);
        pthread_create(&threads[i + 10], NULL, deposit, &ids[i]);
    }

    for (int i = 0; i < 20; i++) {
        pthread_join(threads[i], NULL);
    }

    // Print final balances
    for (int i = 0; i < 10; i++) {
        printf("Account %d balance = %.2f\n", i, accounts[i].balance);
    }

    // Destroy all mutexes
    for (int i = 0; i < 10; i++) {
        pthread_mutex_destroy(&accounts[i].lock);
    }

    return 0;
}
