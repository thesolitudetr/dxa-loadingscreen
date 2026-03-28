AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    deferrals.defer()
    Wait(0)
    
    local weather = "EXTRASUNNY"
    local hour = 12
    local minute = 0

    local configFile = LoadResourceFile(GetCurrentResourceName(), "config.js")
    local useWeatherSync = false
    
    if configFile then
        local match = string.match(configFile, "SyncWithWeatherSync:%s*(%w+)")
        if match and match == "true" then
            useWeatherSync = true
        end
    end

    if useWeatherSync and GetResourceState('qb-weathersync') == 'started' then
        local getWeatherState = exports['qb-weathersync']:getWeatherState()
        if getWeatherState then weather = getWeatherState end

        local getHour, getMinute = exports['qb-weathersync']:getTime()
        if getHour and getMinute then
            hour = getHour
            minute = getMinute
        end
    end

    deferrals.handover({
        weather = weather,
        time = string.format("%02d:%02d", hour, minute),
        players = #GetPlayers(),
        maxPlayers = GetConvarInt('sv_maxclients', 48)
    })
    
    Wait(100)
    deferrals.done()
end)
